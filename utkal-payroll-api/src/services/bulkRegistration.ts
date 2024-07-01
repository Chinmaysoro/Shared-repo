import { hooks as Authentication } from '@feathersjs/authentication';
const { authenticate } = Authentication;
import { BadRequest } from '@feathersjs/errors';
import multer from 'multer';
import csv from 'csv-parser';
import randomstring from 'randomstring';
import fs from 'fs';
import moment from "moment/moment";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});

const upload = multer({ storage: storage });
// console.log("Hello:-",upload);

const bulkRegistration = async function (app){
	app.use(
		'/v1/bulk-registration',
		upload.single('file'),

		function (req, res, next) {
			req.feathers.file = req.file;
      // console.log(req.file);
      
			next();
		},
		{
			async create(data, params) {
				// try{
				const results: string[] = [];
        // console.log("The result:-",data);

				if (!params.file) {
					throw new BadRequest('File Not Found!!!');
				}

				const filePath = params.file.path;

				const email = new Promise((resolve, reject) =>{
					fs.createReadStream(filePath)
						.pipe(csv())
						.on('data', (data) => results.push(data))
						.on('end', () => {
            //  console.log("Hi Chinmay, Result is:-",results);
            //  results.map((items)=> items)
              resolve(results);
						});
            // console.log(results);
            
				});
        

				const emailList:any = await email.then((result) =>{
          // console.log("From emailList:-", result)
					return result;
				});

        // const userId = params.company._id;
        //     console.log("Giligili:-",userId);
        // _____________________________________________________________


        // console.log("emailList:-",emailList);
        // for(let i=1;i<emailList.length;i++){
        //   if(!emailList[i]){
        //     throw new BadRequest(`Ouch!!! csv file is empty`);
        //   };
        // }
        // console.log("Heyy:-",emailList.length);
        
        if(!emailList.length){
          fs.unlinkSync(filePath);
          throw new BadRequest(`Attention!!! csv file is empty`);
        };
        
        emailList.map((objects:any)=>{
         
            if(!objects['Employee FirstName(M)']){
              fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee First Name(M) is empty!`);
            };
            if(!objects['Employee LastName(M)']){
              fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee Last Name(M) is empty!`);
            };
            if(!objects['Employee Email(O)']){
              fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee Email(O) is empty!`);
            };
            if(!objects['Employee Contact No(M)']){
              fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Employee Contact No(M) is empty!`);
            };
            if(!objects['Company(M)']){
              fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Company(M) is empty!`);
            };
            if(!objects['Password(M)']){
              fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Password(M) is empty!`);
            };
            if(!objects['Gender(M)']){
                fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Gender(M) is empty!`);
            };
               if(!objects['Marital status(M)']){
                fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Marital status(M) is empty!`);
            };
               if(!objects['Nationality(M)']){
                fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Nationality(M) is empty!`);
            };
              if(!objects['Religion(M)']){
                fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Religion(M) is empty!`);
            };
               if(!objects['Permanent address(M)']){
                fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Permanent address(M) is empty!`);
            };
               if(!objects['Present address(M)']){
                fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Present address(M) is empty!`);
            };
                if(!objects['Designation(M)']){
                  fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Designation(M) is empty!`);
            };
                if(!objects['Designation(M)']){
                  fs.unlinkSync(filePath);
              throw new BadRequest(`In Sl. No. "${objects['Sl No']}", Designation(M) is empty!`);
            };
        });
        // emailList.map((items:string[])=>console.log("emailList:-",items))

        // _______________________________________________________________________________________
        



				const userIdArr: string[] = [];
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          for (const each of emailList) {
            const userService = app.service('v1/users');
            const companyService = app.service('v1/company');
            const departmentService = app.service('v1/department');
            let userObj;
            // ---------------07/06/24-----------------
            // const createdById = await userService
            //  ._find({
            //   query: {_id: "641342a96e79d1001bb8886c"},
            //   paginate: false,
            // });

            // console.log("createdById:-",createdById);
            // ---------------07/06/24-----------------
            const existingEmail = await userService
            ._find({
              query: {email: each['Employee Email(O)']},
              paginate: false,
            })
            .then((response: any[]) => (response && response[0] ? response[0] : null));
            // console.log("existingEmail:-", existingEmail);
           
            const existingMobile = await userService
            ._find({
              query: {phone: each['Employee Contact No(M)']},
              paginate: false,
            })
            .then((response: any[]) => (response && response[0] ? response[0] : null));
            // console.log("existingMobile:-", existingMobile);

            if(existingEmail && existingMobile){
              fs.unlinkSync(filePath);
              throw new BadRequest(`Delete user from csv file having Email:- "${existingEmail.email}" and Mobile No:- "${existingMobile.phone}"`);
              
            }

            if(existingEmail){
              fs.unlinkSync(filePath);
              throw new BadRequest(`Email:- "${existingEmail.email}" is already exist`);
            }

            if(existingMobile){
              fs.unlinkSync(filePath);
              throw new BadRequest(`Mobile No:- "${existingMobile.phone}" is already exist`);
            }
            
            const companydata = await companyService
            ._find({
              query: {name: each['Company(M)']},
              paginate: false,
            })
            .then((response: any[]) => (response && response[0] ? response[0] : null));     
            console.log("Chinmay, Companydata is:",companydata);
            
            // -------------------------07/06/24-------------------
            if(!companydata){
              fs.unlinkSync(filePath);
              // return {
              //   message: 'Invalid Company in csv',
              //   userList: userIdArr,
              // };
              throw new BadRequest(`Sorry, company "${each['Company(M)']}" doesn't exist!`);
            }
            
              each.companyId = companydata._id;
              
              const departmentData = await departmentService
                ._find({
                  query: {name: each['Employee Department(M)'],  companyId: companydata._id},
                  paginate: false,
                })
                .then((response: any[]) => (response && response[0] ? response[0] : null));

              const designationData = await app.service('v1/designation')
                ._find({
                  query: {name: each['Designation(M)'],  companyId: companydata._id},
                  paginate: false,
                })
                .then((response: any[]) => (response && response[0] ? response[0] : null));

              if(each['Grade(O)']){
                const gradeData = await app.service('v1/grade')
                ._find({
                  query: {name: each['Grade(O)'],  companyId: companydata._id},
                  paginate: false,
                })
                .then((response: any[]) => (response && response[0] ? response[0] : null));
                if (gradeData === null) {
                  const grade = await app.service('v1/grade')._create({
                    name: each['Grade(O)'],
                    companyId: companydata._id
                  });
                  each.gradeId = grade._id;
                }else {
                  each.gradeId = gradeData._id;
                }
              }

              if (departmentData === null) {
                const department = await departmentService._create({
                  name: each['Employee Department(M)'],
                  companyId: companydata._id
                });
                each.departmentId = department._id;
              }else {
                each.departmentId = departmentData._id;
              }

              if (designationData === null) {
                const designation = await app.service('v1/designation')._create({
                  name: each['Designation(M)'],
                  companyId: companydata._id
                });
                each.designationId = designation._id;
              }else {
                each.designationId = designationData._id;
              }

              if(each['Password(M)']){
                each.password = each['Password(M)']
              }
              else {
                each.password = "12345678";

                // each.password = randomstring.generate({
                // length: 8,
                // charset: 'alphabetic',
              // });
            }
              let dobDate = moment(each['DOB(DD-MM-YYYY)(O)'], 'DD-MM-YYYY');
              let dateOfHire
              if(each['Date of hire(O)']){
                dateOfHire =  moment(each['Date of hire(O)'], 'DD-MM-YYYY');
              }
              // @ts-ignore
              dobDate = moment(dobDate).format("MM/DD/YYYY");
              // // @ts-ignore
              dateOfHire = moment(dateOfHire).format("MM/DD/YYYY");
      

               userObj = {
                abbreviation: each['Employee Title(M)']? each['Employee Title(M)']: '',
                firstName: each['Employee FirstName(M)'],
                middleName:each['Employee MiddleName(O)']? each['Employee MiddleName(O)']: '',
                lastName: each['Employee LastName(M)'],
                phone: each['Employee Contact No(M)'],
                alternativePhoneNum: each['Alternative contact no(O)'],
                email: each['Employee Email(O)'].trim().toLowerCase().toString(),
                role: 1,
                departmentId: each.departmentId,
                password: each['password'],
                gender: each['Gender(M)'],
                employmentStatus: each['Employment Type(O)'].toLowerCase(),
                userUniqueId: each['Employee Id(O)'],
                companyId: each.companyId,
                dob: dobDate,
                bloodGroup:  each['Blood group(O)'] ? each['Blood group(O)']: '',
                maritalStatus:  each['Marital status(M)'] ? each['Marital status(M)']: '',
                nationality:  each['Nationality(M)'] ? each['Nationality(M)'] : '',
                religion:  each['Religion(M)'] ? each['Religion(M)'] : '',
                emergencyPhoneNum:  each['Emergency contact no(O)'] ? each['Emergency contact no(O)'] : '',
                address:  each['Present address(M)'] ? each['Present address(M)']: '',
                permanentAddress:  each['Permanent address(M)'] ? each['Permanent address(M)'] : '',
                location:  each['Location(O)'] ? each['Location(O)'] : '',
                division:  each['Division(O)'] ? each['Division(O)'] : '',
                doj:  dateOfHire ? dateOfHire : new Date(),
                empId:  each['Employee Id(O)'] ? each['Employee Id(O)'] : '',
                workMail:  each['Work email Id(O)'] ? each['Work email Id(O)'] : '',
                cugNo:  each['CUG No(O)'] ? each['CUG No(O)'] : '',
                biometricId:  each['Biometric id(O)'] ? each['Biometric id(O)'] : '',
                bankName:  each['Bank name(O)'] ? each['Bank name(O)'] : '',
                branch:  each['Branch(O)'] ? each['Branch(O)'] : '',
                ifsc:  each['IFSC code(O)'] ? each['IFSC code(O)'] : '',
                accountNumber:  each['Account no(O)'] ? each['Account no(O)'] : '',
                pan:  each['PAN(O)'] ? each['PAN(O)'] : '',
                aadhar:  each['Aadhar no(O)'] ? each['Aadhar no(O)'] : '',
                voter:  each['Voter ID(O)'] ? each['Voter ID(O)'] : '',
                uan:  each['UAN No(O)'] ? each['UAN No(O)'] : '',
                esicNo:  each['ESIC No(O)'] ? each['ESIC No(O)'] : '',
                drivingLicence:  each['Driving license(O)'] ? each['Driving license(O)']: ''
              }
              if(each['Designation(M)']){
                userObj['designationId'] =  each.designationId
              }
              if(each['Grade(O)']){
                userObj['gradeId'] =  each.gradeId
              }
              // if(data.canteenId){ userObj.canteenId = data.canteenId}
              try{

                const userDataList = await userService.create(userObj);
                userIdArr.push(userDataList?._id);
              }catch(err){
                // console.log(err);
                
                userIdArr.push(userObj?.email);
              }
      }
          fs.unlinkSync(filePath);
          return {
            message: 'Voila!!! Bulk data uploaded successfully',
            userList: userIdArr,
          };
        }
        catch (error) {
          // console.log(error);
          //  fs.unlinkSync(filePath);
          throw new BadRequest(error);
          // throw new BadRequest('File contains duplicate data');
        }
			},
		},
	);

  const service = app.service('v1/bulk-registration');

	service.hooks({
		before: {
			create: [authenticate('jwt')],
		},
		after: {
			create: [],
		},
	});
};
export default bulkRegistration;
