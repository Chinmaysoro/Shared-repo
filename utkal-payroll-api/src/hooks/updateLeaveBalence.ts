import cron from 'node-cron';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const updateLeaveBalence = async (app: any) => {
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

        const leavePolicyService = app.service('v1/leave-policy');
        const leaveBalanceService = app.service('v1/leave-balance');
        const leaveeService = app.service('v1/leave');



        const leavePolicyData = await leavePolicyService._find({
          query: {
            $sort: {
              createdAt: -1 // Sort in descending order based on createdAt field (change it based on your data structure)
              }
            },
            paginate: false
            });

            if(leavePolicyData.length > 0){
              const promises = userData.map((each) => {
                return new Promise(async function(resolve, reject) {
                  try {
                  
                   
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
            }
      return;
  });
};

export default updateLeaveBalence;

