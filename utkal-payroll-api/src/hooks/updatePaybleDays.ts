import cron from 'node-cron';
import fetchWorkingDaysByUser from './fetchWorkingDaysByUser';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const updatePaybleDays = async (app: any) => {
	await cron.schedule('0 6 1 * *', async () => { //
		const userService = app.service('v1/users');
		const userData = await userService._find({
			query: {
				role: 1,
          $sort: {
              createdAt: -1 // Sort in descending order based on createdAt field (change it based on your data structure)
            }
			},
      paginate: false
		});
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);

        const resultMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0-11)
        const resultYear = currentDate.getFullYear();
		    const promises = userData.map((each) => {
            return new Promise(async function(resolve, reject) {
              try {
                if(each?.companyId){
                    const result = await fetchWorkingDaysByUser(app, [each._id], resultMonth, resultYear);
                   
                    const payslipService = app.service('v1/payslip');
                    const payslipData = await payslipService.find({
                      query:{
                        userId: each._id,
                        companyId: each?.companyId,
                        month: resultMonth,
                        year: resultYear,
                      }
                    })
                    if(payslipData.data.length > 0){
                      await payslipService.patch(payslipData.data[0]._id,{
                        userId: each._id,
                        companyId: each?.companyId,
                        month: resultMonth,
                        year: resultYear,
                        paybleDays: result[0]['totalPaidDays'],
                        totalPaybleDays: result[0]['totalPayableDaysInMonth']
                      });
                    }else {
                      await payslipService.create({
                        userId: each._id,
                        companyId: each?.companyId,
                        month: resultMonth,
                        year: resultYear,
                        paybleDays: result[0]['totalPaidDays'],
                        totalPaybleDays: result[0]['totalPayableDaysInMonth']
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
          } catch (error) {
            console.error("Error occurred while processing promises:", error);
          }
          
		return;
	});
};

export default updatePaybleDays;
