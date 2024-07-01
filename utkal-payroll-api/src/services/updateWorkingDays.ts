import { BadRequest } from '@feathersjs/errors';
import * as authentication from '@feathersjs/authentication';
import fetchWorkingDaysByUser from '../hooks/fetchWorkingDaysByUser';
const { authenticate } = authentication.hooks;

const updateWorkingDays = (app) => {
  app.use('/v1/updateWorkingDays', {
    async create(data,params) {

      const { month, year, companyId, userArr} = data;
      const userService = app.service('v1/users');
      let queryObj = {}
      if(companyId){
        queryObj = {
          role: 1,
          companyId,
            $sort: {
                createdAt: -1 // Sort in descending order based on createdAt field (change it based on your data structure)
              }
        }
      }else if(userArr){
        queryObj = {
          role: 1,
          _id: {
            $in: [userArr]
          },
            $sort: {
                createdAt: -1 // Sort in descending order based on createdAt field (change it based on your data structure)
              }
        }
      }

      const userData = await userService._find({
        query: queryObj,
        paginate: false
      });
    
          const promises = userData.map((each) => {
              return new Promise(async function(resolve, reject) {
                try {
                  if(each?.companyId){
                      const result = await fetchWorkingDaysByUser(app, [each._id], month, year);
                     
                      const payslipService = app.service('v1/payslip');
                      const payslipData = await payslipService._find({
                        query:{
                          userId: each._id,
                          companyId: each?.companyId,
                          month: month,
                          year: year,
                          salaryStatus: {
                            $in: ['unprocessed']
                          },
                        }
                      })
                      if(payslipData.data.length > 0){
                        await payslipService._patch(payslipData.data[0]._id,{
                          userId: each._id,
                          companyId: each?.companyId,
                          month: month,
                          year: year,
                          paybleDays: result[0]['totalPaidDays'],
                          totalPaybleDays: result[0]['totalPayableDaysInMonth'],
                          salaryStatus:'unprocessed'
                        });
                      }
                      resolve(each);
                  }
                 
                } catch (error) {
                  reject(error); // Ensure to reject the promise in case of an error
                }
              });
            });
            
            try {
              await Promise.all(promises);
              return {message: 'Payble Days Updated Successfully'}
            } catch (error) {
              throw new BadRequest('Payble Days Not Updated')
            }
    },
  });

  const service = app.service('v1/updateWorkingDays');



  service.hooks({
    before: {
      create: [authenticate('jwt')],
    },
    after: {
      create: [],
    },
  });
};
export default updateWorkingDays;
