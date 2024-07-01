import generateReportForUser from "./generateReportForUser";

async function generateAttendanceReport(app, companyId, startDate, endDate, userData) {
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
  
    const promises = userData.map(async (each) => {
      return new Promise(async function (resolve) {
        const attendanceData = await app.service('v1/attendance').find({
          query: {
            attendanceDate: {
              $gte: startDate.toDate(),
              $lte: endDate.toDate(),
            },
            companyId: companyId,
            createdBy: each._id
          },
          paginate: false,
        });
  
        let companyShiftQuery = { companyId: companyId}
        if(each.companyShiftId){
          companyShiftQuery['_id'] = each.companyShiftId
        }
  
        const companyShiftData = await app.service('v1/company-shift')._find({
          query: companyShiftQuery,
          paginate: false,
        });
        const weeklyOffDays = companyShiftData[0] && companyShiftData[0].weeklyOff[0] && companyShiftData[0].weeklyOff.map((item) => item.weeklyOffDay)
  
        const leaveData = await app.service('v1/leave').find({
          query: {
            startDate: {
              $gte: startDate.toDate(),
            },
            endDate: {
              $lte: endDate.toDate(),
            },
            createdBy: each._id,
            companyId: companyId,
          },
          paginate: false,
        });
  
        const report = generateReportForUser(each, attendanceData, holidayData, leaveData, weeklyOffDays,startDate,endDate);
  
        resolve({ report: report, user: each });
      });
    });
  
    return Promise.all(promises);
  }

  export default generateAttendanceReport;