import { Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

export class Payslip extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }
//   async find(params?: Params): Promise<any> {
//     // console.log(params);
//     params = params || {};
//     params.query = params.query || {};
    
//     params.query.$populate = [
//       {
//         path: 'userId', // Adjust the path as per your data structure
//         select: 'firstName middleName lastName empId designationId ', // Include only the necessary fields
//         $populate:{
//           path: 'designationId', // Adjust the path as per your data structure
//           select: 'name',
//         }
//       }
//     ];
// // console.log(params.query);
    
//     return super.find(params);
//   }
}
