import { hooks as Authentication } from '@feathersjs/authentication';
const { authenticate } = Authentication;
import { BadRequest } from '@feathersjs/errors';
import multer from 'multer';
import csv from 'csv-parser';
import randomstring from 'randomstring';
import fs from 'fs';
import moment from "moment";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

const bulkUploadAttendance = async function (app:any){
  app.use(
    '/v1/bulk-upload-attendance',
    upload.single('file'),

   async function (req, res, next) {
      // console.log(req.file);
      req.feathers.file = req.file;
      next();
    },
    {
      async create(data, params) {
        // try{
        const results: string[] = [];

        if (!params.file) {
          throw new BadRequest('File Not Found!!!');
        }

        const filePath = params.file.path;

        const email = new Promise(function (resolve, reject) {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
              resolve(results);
            });
        });

        const emailList:any = await email.then((result) => {
          return result;
        });
        console.log("Email List:-",emailList.length);

        if (!emailList.length) {
          throw new BadRequest(`Attention!!! csv file is empty`);
        }

        emailList.map((objects:any)=>{
          // console.log(objects);
          if(objects['Employee ID']==""){
            fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee ID is empty!`);
          };
          if(objects['Employee AttendanceDate']==""){
            fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee Attendance Date is empty!`);
          };
          if(objects['Clock-In Time']==""){
            fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee's Clock-In Time is empty!`);
          };
          if(objects['Clock-Out Time']==""){
            fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee's Clock-Out Time is empty!`);
          };
        })
        
        // if(!emailList.length || !emailList[0]){
        //   // fs.unlinkSync(filePath);
        //   throw new BadRequest(`Attention!!! csv file is empty`);
        // };

        // emailList.map((objects:any)=>{
        //   console.log(objects);
        //   if(!objects['Sl No']){
        //     fs.unlinkSync(filePath);
        //     throw new BadRequest(`Please Initiate a serial no`);
        //   };
          
        // })

        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const promises = emailList.map(async (each: any) => {
            // eslint-disable-next-line

            // return keyword removed...
            new Promise(async function (resolve, reject) {
              const userService = app.service('v1/users');
              const attendanceService = app.service('v1/attendance');
              const companyShiftService = app.service('v1/company-shift');

              const usertData = await userService
                ._find({
                  query: {empId: each['Employee ID']},
                  paginate: false,
                })
                .then((response: any[]) => (response && response[0] ? response[0] : null));
                console.log("User Data:-",usertData);
                
               if(!usertData){
                  fs.unlinkSync(filePath);
                  throw new BadRequest(`Employee ID:- ${each['Employee ID']} is not registered with us`);
                }

                // let attendanceQuery = {userId:usertData._id};
                // console.log("Attendance Query", attendanceQuery);
                
                //  const attendanceData = await attendanceService
                // ._find({
                //   query: {createdBy: attendanceQuery.userId},
                //   paginate: false,
                // })
                // .then((response: any[]) => (response && response[0] ? response[0] : null));
                
                // console.log("Attendance Data:-",attendanceData);
               
                // if(attendanceData){
                //   if(attendanceData._id == usertData._id){
                //     const date = moment(attendanceData.attendanceDate);
                //     const formattedDate = date.format('DD-MM-YYYY');
                //     if(formattedDate == each['Employee AttendanceDate']){
                //       throw new BadRequest("Data already exist")
                //     }
                //     console.log("Attendance createdBy:-",attendanceData.createdBy);
                //     console.log("User Data:-",usertData._id);
                //     console.log("Attendance Data:-",formattedDate);
                //     console.log("Available Data:,",each['Employee AttendanceDate']);
                //   }
                // }
                

              let companyShiftQuery = { companyId: usertData.companyId}
              // console.log("CCYT:-",companyShiftQuery);
              
              if(usertData.companyShiftId){
                companyShiftQuery['_id'] = usertData.companyShiftId
              }
          
              let companyShiftData = await companyShiftService._find({
                query: companyShiftQuery,
                paginate: false,
              });
              // console.log("Company Shift Data:-", companyShiftData);
              // companyShiftData.map((item)=>{
              //   console.log("Hello Starttime is:-",item);
              //   // if(item.startTime == each['Employee AttendanceDate']){}
              
                
              // }) 
              companyShiftData = companyShiftData[0];
              /*------------------11/06/2024--------------- */
              if(!companyShiftData){
                fs.unlinkSync(filePath);
              throw new BadRequest(`Company shift data not available***!`);
              }
              /*------------------11/06/2024--------------- */
              let attendanceDate = moment(each['Employee AttendanceDate'], 'DD-MM-YYYY');
              // @ts-ignore
              attendanceDate = moment(attendanceDate).format("MM/DD/YYYY");
              let obj = {
                createdBy: usertData._id,
                attendanceDate: new Date(attendanceDate + ' ' +each['Clock-In Time'] ),
                startTime: new Date(attendanceDate + ' ' +each['Clock-In Time']),
                endTime: new Date(attendanceDate + ' ' +each['Clock-Out Time']),
                companyId:usertData.companyId
              }
              // obj.startTime = new Date(obj.startTime.setMinutes(obj.startTime.getMinutes() - 330))
              // obj.endTime = new Date(obj.endTime.setMinutes(obj.endTime.getMinutes() - 330))
              const minutes = (obj.endTime.getTime() - obj.startTime.getTime()) / 60000;

              if(companyShiftData.minimumHalfDayHR && companyShiftData.minimumFullDayHR){
                if(minutes < companyShiftData.minimumHalfDayHR ){
                  obj['attendanceStatus'] = 'absent'
                }else if(minutes >= (companyShiftData.minimumHalfDayHR) && minutes < (companyShiftData.minimumFullDayHR)){
                  obj['attendanceStatus'] = 'halfDay'
                }else {
                  obj['attendanceStatus'] = 'fullDay'
                }
              }else {
                if(minutes < 240 ){
                  obj['attendanceStatus'] = 'absent'
                }else if(minutes >= 240 && minutes < 360){
                  obj['attendanceStatus'] = 'halfDay'
                }else {
                  obj['attendanceStatus'] = 'fullDay'
                }
              }
              const attendanceDataList = await attendanceService._create(obj);
              resolve(attendanceDataList);
            });
          });

          await Promise.all(promises);
          fs.unlinkSync(filePath);
          return {
            message: 'Bulk attendance uploaded successfully'
          };
        }
        catch (error) {
          console.log("Hi:-",error);
          throw new BadRequest(error);
        }
      },
    },
  );

  const service = app.service('v1/bulk-upload-attendance');

  service.hooks({
    before: {
      create: [authenticate('jwt')],
    },
    after: {
      create: [],
    },
  });
};
export default bulkUploadAttendance;
