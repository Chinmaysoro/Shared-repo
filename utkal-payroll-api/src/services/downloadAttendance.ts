import { createObjectCsvWriter } from 'csv-writer'
import * as fsExtra from "fs-extra";
import Fs from 'fs';
import Excel from 'exceljs';
import { BadRequest } from "@feathersjs/errors";
import moment from 'moment';
import momenttz from 'moment-timezone';


const downloadAttendance = (app: any) => {
  app.get('/v1/download-attendance', async (req: any, res: any) => {
    const getDateOnly = (date) => {
      const currentDate = new Date(date)
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
      const year = currentDate.getFullYear();
      return `${day}/${month}/${year}`
    }
    function getTimeDifferenceInSeconds(dateString1, dateString2) {
      
      // Create moment objects from the input date strings in the "Asia/Kolkata" timezone
      const moment1 = momenttz.utc(dateString1).tz("Asia/Kolkata").format('HH:mm:ss');
      const moment2 =momenttz.utc(dateString2).tz("Asia/Kolkata").format('HH:mm:ss');
      // Compare only time using moment's diff function
      const diffInMilliseconds = moment(moment2, 'HH:mm:ss').diff(moment(moment1, 'HH:mm:ss'));
    
      if (diffInMilliseconds < 0) {
        return "Time not available";
      }
    
      // Convert the time difference to seconds
      const diffInSeconds = moment.duration(diffInMilliseconds).asSeconds();
    
      // Calculate hours, minutes, and remaining seconds
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const remainingSeconds = Math.floor(diffInSeconds % 60);
    
      // Format the time difference
      return `${hours}:${minutes}:${remainingSeconds}`;
    }
    const generateUserAttendanceReport = async (app, worksheet, userData, month, year, companyId) => {
      let slNo = 1;

      const startDate = moment(`${year}-${month}-01`).startOf('month');
      // Get the last day of the specified month
      const endDate = moment(startDate).endOf('month');
      console.log(userData.firstName)


    while (startDate.isSameOrBefore(endDate)) {
      const attendanceData = await app.service('v1/attendance').find({
        query: {
          attendanceDate: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
          companyId: companyId,
          createdBy: userData._id
        },
        paginate: false,
      });


      let companyShiftQuery = { companyId: companyId}
        if(userData.companyShiftId){
          companyShiftQuery['_id'] = userData.companyShiftId
        }

        const companyShiftData = await app.service('v1/company-shift')._find({
          query: companyShiftQuery,
          paginate: false,
        });
        // console.log(companyShiftData)
        let holidayData = await app.service('v1/holiday-list').find({
          query: {
            attendanceDate: {
              $gte: startDate.toDate(),
              $lte: endDate.toDate(),
            },
            companyId: companyId,
          },
          paginate: false,
        });
        const weeklyOffDays = companyShiftData[0] && companyShiftData[0].weeklyOff[0] && companyShiftData[0].weeklyOff.map((item) => item.weeklyOffDay)
        // Query leave data for the specified month
        const leaveData = await app.service('v1/leave').find({
          query: {
            startDate: {
              $gte: startDate.toDate(),
            },
            endDate: {
              $lte: endDate.toDate(),
            },
            createdBy: userData._id,
            companyId: companyId,
          },
          paginate: false,
        });
      const currentDate = startDate.toDate();
      const matchingRecord = attendanceData.find(record => moment(record.attendanceDate).isSame(currentDate, 'day'));

      const isLeave = leaveData.some((leave) =>
      moment(currentDate).isBetween(moment(leave.startDate), moment(leave.endDate), null, '[]')
    );
    const isPresentFd = attendanceData.some((attendance) => moment(attendance.attendanceDate).isSame(currentDate, 'day') && attendance.attendanceStatus === 'fullDay');
    const isPresentHd = attendanceData.some((attendance) => moment(attendance.attendanceDate).isSame(currentDate, 'day') && attendance.attendanceStatus === 'halfDay');
    const isHoliday = holidayData.some((holiday) => moment(holiday.attendanceDate).isSame(currentDate, 'day'));
    let status = 'A'// Default to present
    if (currentDate > new Date()) {
      status = 'NA'; // Date is greater than current date
    }
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });

    if (weeklyOffDays.includes(dayOfWeek)) {
      status = 'WO'; // Date is greater than current date
    } 
    else if (isLeave) {
      status = 'L'; // Leave
    } else if (isPresentFd) {
      status = 'P'; // Present
    } else if (isPresentHd) {
      status = 'HD'; // Present HD
    } 
    if (isHoliday) {
      status = 'PH'; // Holiday
    }
      if (matchingRecord) {
        // If there's attendance data for the current date, add the data to the row
        worksheet.addRow([
          slNo,
          getDateOnly(matchingRecord.attendanceDate),
          companyShiftData[0].name,
          momenttz.utc(matchingRecord.startTime).tz("Asia/Kolkata").format('HH:mm:ss'),
          momenttz.utc(matchingRecord.endTime).tz("Asia/Kolkata").format('HH:mm:ss'),
          getTimeDifferenceInSeconds(companyShiftData[0].startTime,matchingRecord.startTime),
          getTimeDifferenceInSeconds(matchingRecord.endTime,companyShiftData[0].endTime),
          status || 'NA',
        ]);
      } else {

        // If there's no attendance data, add a blank row with the current date
        worksheet.addRow([slNo, getDateOnly(currentDate), companyShiftData[0].name, 'NA', 'NA', 'NA', 'NA', status]);
      }
      slNo = slNo + 1;
      // Move to the next day
      startDate.add(1, 'day');
    }
   
    }

    const getDatewiseAttendance = async(worksheet, date, companyId, userData, app, serialNumber) => {
      const attendanceData = await app.service('v1/attendance').find({
        query: {
          attendanceDate: {
            $gte: (new Date(date)).getTime(),
            $lte: new Date((new Date(date)).getTime() + 24 * 60 * 60 * 1000).getTime(), // Next day
          },
          companyId: companyId,
          createdBy: userData._id,
        },
        paginate: false,
      });

      const userAttendance = attendanceData[0]; // Assuming a user has only one attendance record for a day

      const status = userAttendance ? userAttendance.attendanceStatus : 'Absent';
      const inTime = userAttendance ? momenttz.utc(userAttendance.startTime).tz("Asia/Kolkata").format('HH:mm:ss') : '-';
      const outTime = userAttendance ? momenttz.utc(userAttendance.endTime).tz("Asia/Kolkata").format('HH:mm:ss') : '-';
      const workDuration = userAttendance ? moment.utc(moment(userAttendance.endTime).diff(moment(userAttendance.startTime))).format('HH:mm') : '00:00';

      const department = userData.departmentId?userData.departmentId.name:''
      const designation = userData.designationId? userData.designationId.name:''
      let companyShiftQuery = { companyId: companyId}
      if(userData.companyShiftId){
        companyShiftQuery['_id'] = userData.companyShiftId
      }

      const companyShiftData = await app.service('v1/company-shift')._find({
        query: companyShiftQuery,
        paginate: false,
      });

      worksheet.addRow([
        serialNumber,
        userData.empId,
        `${userData.firstName}${' '}${ userData.lastName}`,
        designation,
        department,
        companyShiftData[0].name,
        inTime,
        outTime,
        workDuration,
        status,
      ]);

    }
     if(req.query.downloadIndividualReport){
      const { month, year, companyId, userId } = req.query;
      if(userId){
        const userService = app.service('v1/users');
        let userData = await userService
          ._find({
            query: {  companyId: companyId, role: 1, $populate: ['departmentId', 'designationId', 'gradeId'],...userId ? {_id: userId}: {}},
            paginate: false,
          })
          userData = userData[0]
          const workbook = new Excel.Workbook();
      
          const startDate = moment(`${year}-${month}-01`).startOf('month');
          // Get the last day of the specified month
          const endDate = moment(startDate).endOf('month');
          try {
            workbook.creator = "UtkalSmart";
            workbook.created = new Date();
            const worksheet = workbook.addWorksheet("sheet1");
            worksheet.properties.defaultColWidth = 25; 
            const attendanceData = await app.service('v1/attendance').find({
              query: {
                attendanceDate: {
                  $gte: startDate.toDate(),
                  $lte: endDate.toDate(),
                },
                companyId: companyId,
                createdBy: userData._id
              },
              paginate: false,
            });
    
    
            let companyShiftQuery = { companyId: companyId, deleted: false}
              if(userData.companyShiftId){
                companyShiftQuery['_id'] = userData.companyShiftId
              }
    
              let companyShiftData = await app.service('v1/company-shift')._find({
                query: companyShiftQuery,
                paginate: false,
              });
              // console.log(companyShiftData)
              let holidayData = await app.service('v1/holiday-list').find({
                query: {
                  attendanceDate: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                  },
                  companyId: companyId,
                },
                paginate: false,
              });
              const weeklyOffDays = companyShiftData[0] && companyShiftData[0].weeklyOff[0] && companyShiftData[0].weeklyOff.map((item) => item.weeklyOffDay)
              // Query leave data for the specified month
              const leaveData = await app.service('v1/leave').find({
                query: {
                  startDate: {
                    $gte: startDate.toDate(),
                  },
                  endDate: {
                    $lte: endDate.toDate(),
                  },
                  createdBy: userData._id,
                  companyId: companyId,
                },
                paginate: false,
              });
  
            const companyData = await app.service('v1/company').get(companyId)
            const specialRowOne = worksheet.addRow(['Detailed Monthly Report (Individual)']);
            const specialRowTwo  = worksheet.addRow([`Company: ${companyData.name}`]);
            const specialRowThree = worksheet.addRow([`Attendance Master Report ${getDateOnly(startDate)} to  ${getDateOnly(endDate)}`]);
            specialRowOne.getCell(1).alignment = { horizontal: 'center' };
            specialRowOne.getCell(1).font = { bold: true };
            specialRowTwo.getCell(1).alignment = { horizontal: 'center' };
            specialRowTwo.getCell(1).font = { bold: true };
            specialRowThree.getCell(1).alignment = { horizontal: 'center' };
            specialRowThree.getCell(1).font = { bold: true };
            worksheet.mergeCells(specialRowOne.number, 1, specialRowOne.number, 8);
            worksheet.mergeCells(specialRowTwo.number, 1, specialRowTwo.number, 8);
            worksheet.mergeCells(specialRowThree.number, 1, specialRowThree.number, 8);
            const headerOne = worksheet.addRow(['Emp Code', 'Name', 'Division', 'Department', 'Designation', 'Grade', 'Biometric id', 'Downloaded On']);
            headerOne.eachCell((cell) => {
              cell.font = { bold: true };
            });         
            worksheet.addRow([userData.empId, userData.firstName+ ' '+  userData.lastName, userData.division, userData.departmentId? userData.departmentId.name: '', userData.designationId.name, userData.gradeId? userData.gradeId.name: '', userData.biometricId, momenttz.utc(new Date()).tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')]);
            const headerTwo = worksheet.addRow(['Sl.No', 'Date', 'Shift', 'In Time', 'Out Time', 'Late Coming', 'Early Going', 'Status']);
            headerTwo.eachCell((cell) => {
              cell.font = { bold: true };
            });
            let slNo = 1;
            while (startDate.isSameOrBefore(endDate)) {
              const currentDate = startDate.toDate();
              const matchingRecord = attendanceData.find(record => moment(record.attendanceDate).isSame(currentDate, 'day'));
        
              const isLeave = leaveData.some((leave) =>
              moment(currentDate).isBetween(moment(leave.startDate), moment(leave.endDate), null, '[]')
            );
            const isPresentFd = attendanceData.some((attendance) => moment(attendance.attendanceDate).isSame(currentDate, 'day') && attendance.attendanceStatus === 'fullDay');
            const isPresentHd = attendanceData.some((attendance) => moment(attendance.attendanceDate).isSame(currentDate, 'day') && attendance.attendanceStatus === 'halfDay');
            const isHoliday = holidayData.some((holiday) => moment(holiday.attendanceDate).isSame(currentDate, 'day'));
            let status = 'A'// Default to present
            if (currentDate > new Date()) {
              status = 'NA'; // Date is greater than current date
            }
            const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });
  
            if (weeklyOffDays.includes(dayOfWeek)) {
              status = 'WO'; // Date is greater than current date
            } 
            else if (isLeave) {
              status = 'L'; // Leave
            } else if (isPresentFd) {
              status = 'P'; // Present
            } else if (isPresentHd) {
              status = 'HD'; // Present HD
            } 
            if (isHoliday) {
              status = 'PH'; // Holiday
            }
              if (matchingRecord) {
  
                // If there's attendance data for the current date, add the data to the row
                worksheet.addRow([
                  slNo,
                  getDateOnly(matchingRecord.attendanceDate),
                  companyShiftData[0].name,
                  momenttz.utc(matchingRecord.startTime).tz("Asia/Kolkata").format('HH:mm:ss'),
                  momenttz.utc(matchingRecord.endTime).tz("Asia/Kolkata").format('HH:mm:ss'),
                  getTimeDifferenceInSeconds(companyShiftData[0].startTime,matchingRecord.startTime),
                  getTimeDifferenceInSeconds(matchingRecord.endTime,companyShiftData[0].endTime),
                  status || 'NA',
                ]);
              } else {
                // If there's no attendance data, add a blank row with the current date
                worksheet.addRow([slNo, getDateOnly(currentDate), companyShiftData[0].name, 'NA', 'NA', 'NA', 'NA', status]);
              }
              slNo = slNo += 1
              // Move to the next day
              startDate.add(1, 'day');
            }
        
          } catch (e) {
            console.error(e);
            throw new BadRequest('Error While Writing to Excel');
          }
        let currDate = new Date().toString();
        const fileName = `attendanceReport-${currDate}-Report.xlsx`;
  
        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
  
        workbook.xlsx.write(res).then(function () {
          res.end();
        });
      }else{
        const { month, year, companyId, userId } = req.query;
          const userService = app.service('v1/users');
          const startDate = moment(`${year}-${month}-01`).startOf('month');
          // Get the last day of the specified month
          const endDate = moment(startDate).endOf('month');

          const workbook = new Excel.Workbook();
          workbook.creator = "UtkalSmart";
          workbook.created = new Date();

          try {
            const worksheet = workbook.addWorksheet('Combined Report'); // Add a single worksheet for all users
            worksheet.properties.defaultColWidth = 15;

            const users = await userService._find({
              query: { companyId: companyId, role: 1, $populate: ['departmentId', 'designationId', 'gradeId'] },
              paginate: false,
            });
            const companyData = await app.service('v1/company').get(companyId)
            console.log(users.length, companyData)
            for (const userData of users) {
              const specialRow = worksheet.addRow(['']);

              const specialRowOne = worksheet.addRow(['Detailed Monthly Report (Combined)']);
              const specialRowTwo =  worksheet.addRow([`Company: ${companyData.name}`]);
              const specialRowThree = worksheet.addRow([`Attendance Master Report ${getDateOnly(startDate)} to  ${getDateOnly(endDate)}`]);
              specialRowOne.getCell(1).alignment = { horizontal: 'center' };
              specialRowOne.getCell(1).font = { bold: true };
              specialRowTwo.getCell(1).alignment = { horizontal: 'center' };
              specialRowTwo.getCell(1).font = { bold: true };
              specialRowThree.getCell(1).alignment = { horizontal: 'center' };
              specialRowThree.getCell(1).font = { bold: true };
              worksheet.mergeCells(specialRow.number, 1, specialRow.number, 8);
              worksheet.mergeCells(specialRowOne.number, 1, specialRowOne.number, 8);
              worksheet.mergeCells(specialRowTwo.number, 1, specialRowTwo.number, 8);
              worksheet.mergeCells(specialRowThree.number, 1, specialRowThree.number, 8);
            
              const headerOne = worksheet.addRow(['Emp Code', 'Name', 'Division', 'Department', 'Designation', 'Grade', 'Biometric id', 'Downloaded On']);
              headerOne.eachCell((cell) => {
                cell.font = { bold: true };
              });
            
              worksheet.addRow([userData.empId, userData.firstName + ' ' + userData.lastName, userData.division, userData.departmentId ? userData.departmentId.name: '', userData.designationId ?userData.designationId.name: '', userData.gradeId ? userData.gradeId.name: '', userData.biometricId, momenttz.utc(new Date()).tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')]);
              const headerTwo = worksheet.addRow(['Sl.No', 'Date', 'Shift', 'In Time', 'Out Time', 'Late Coming', 'Early Going', 'Status']);
              headerTwo.eachCell((cell) => {
                cell.font = { bold: true };
              });
              await generateUserAttendanceReport(app, worksheet, userData, month, year, companyId);
            }

            // Your existing code for writing the workbook and sending the response goes here...
            const currDate = new Date().toString();
            const fileName = `attendanceReport-${currDate}-Report.xlsx`;

            res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

            workbook.xlsx.write(res).then(function () {
              res.end();
            });

          } catch (e) {
            console.error(e);
            throw new BadRequest('Error While Creating Attendance Reports');
          }

      }        
    }
    else if(req.query.downloadDateWiseReport){
      
      try {
        const { date, companyId } = req.query;
        const userService = app.service('v1/users');
        const users = await userService._find({
          query: { companyId: companyId, $populate: ['departmentId', 'designationId', 'gradeId'] },
          paginate: false,
        });
        const companyData = await app.service('v1/company').get(companyId)

        const workbook = new Excel.Workbook();

        const worksheet = workbook.addWorksheet("sheet1");

         const specialRowOne = worksheet.addRow([`Daily Attendance Report ${getDateOnly(date)}`]);
          const specialRowTwo  =  worksheet.addRow([`Company: ${companyData.name}`]);
          specialRowOne.getCell(1).alignment = { horizontal: 'center' };
          specialRowOne.getCell(1).font = { bold: true };
          specialRowTwo.getCell(1).alignment = { horizontal: 'center' };
          specialRowTwo.getCell(1).font = { bold: true };

          worksheet.mergeCells(specialRowOne.number, 1, specialRowOne.number, 8);
          worksheet.mergeCells(specialRowTwo.number, 1, specialRowTwo.number, 8);
    
   
    
        worksheet.properties.defaultColWidth = 15;
    
        // Add header row
        const headerRow = worksheet.addRow(['SNo', 'E. Code', 'Name', 'Designation', 'Department', 'Shift', 'InTime', 'OutTime', 'Work Duration', 'Status']);
        headerRow.font = { bold: true };
    
        await Promise.all(users.map(async (userData) => {
          let serialNumber = 1
          await getDatewiseAttendance(worksheet, date, companyId, userData, app, serialNumber)
          serialNumber= serialNumber + 1
        }))
        // Your existing code for sending the response goes here...
        const currDate = new Date().toString();
        const fileName = `dailyAttendanceReport-${currDate}.xlsx`;
    
        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    
        workbook.xlsx.write(res).then(function () {
          res.end();
        });
    
      } catch (e) {
        console.error(e);
        throw new BadRequest('Error While Generating Daily Attendance Report');
      }
    }
    else{
      try {

        fsExtra.emptyDirSync('temp');
  
        if (!Fs.existsSync('temp')){
          Fs.mkdirSync('temp');
        }
  
        const path = `temp/${'file'+Date.now()}.csv`
        const csvWriter = createObjectCsvWriter({
          path: path,
          header: [
            {id: 'name', title: 'name'},
            {id: 'attendanceDate', title: 'attendanceDate'},
            {id: 'startTime', title: 'startTime'},
            {id: 'endTime', title: 'endTime'},
            {id: 'note', title: 'note'},
            {id: 'checkOutBy', title: 'checkOutBy'},
            {id: 'attendanceStatus', title: 'attendanceStatus'},
          ]
        });
        const { query}  = req;
        const { createdBy }  = query;
  
        let queryData = {
          $populate: ['createdBy'],
        }
        if(createdBy){
          queryData = {
            ...queryData,
            ...query
          }
        }
  
        const attendanceService = app.service('v1/attendance');
  
        const attendanceData = await attendanceService
          ._find({
            query: queryData,
            paginate: false,
          })
  
  
        const records = [];
  
        await attendanceData.forEach((fe: any) => {
          console.log(`${fe.createdBy.firstName}' ` + fe.createdBy.lastName,)
          // @ts-ignore
          return records.push({
              name: `${fe.createdBy.firstName}' ` + fe.createdBy.lastName,
              attendanceDate: new Date(fe.attendanceDate).toLocaleString() ? new Date(fe.attendanceDate).toLocaleString() : '',
              attendanceStatus: fe?.attendanceStatus,
              checkOutBy: fe?.checkOutBy,
              note: fe.note,
              startTime: new Date(fe.startTime).toLocaleString(),
              endTime: new Date(fe.startTime).toLocaleString()
            })
        })
  
        await csvWriter.writeRecords(records)
          .then(() => {
            res.download(path);
          });
        // Fs.unlinkSync(path);
  
  
      } catch (err) {
        /* eslint-disable no-console */
        console.log('OOOOOOO this is the error: ' + err);
      }
    }
  });
};

export default downloadAttendance;
