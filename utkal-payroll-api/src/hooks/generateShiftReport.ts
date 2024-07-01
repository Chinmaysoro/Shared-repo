
async function generateShiftReport(app, companyId, startDate, endDate, userData) {
    let shiftpolicyData = await app.service('v1/shift-policy').find({
      query: {
        companyId: companyId,
        $populate: ['companyShiftId','entityId'],
      },
      paginate: false,
    });
    shiftpolicyData = shiftpolicyData[0]
    if(shiftpolicyData.entityType === 'company'){
        let report = []

        const promises = userData.map(async (each) => {
        return new Promise(async function (resolve) {
            let dayCounter = 0;


            while (startDate <= endDate) {
                const date = startDate.toDate();
                let status = 'G'; // Default to General Shift
            
                dayCounter++;

                // Change status every shiftpolicyData.rotationFrequency days
                if (dayCounter % shiftpolicyData.rotationFrequency === 0) {
                    // Calculate the rotation index based on the day counter
                    const rotationIndex = (dayCounter / shiftpolicyData.rotationFrequency) % shiftpolicyData.companyShiftId.length;
            
                    // Update status if there's an object at that index in companyShiftId
                    if (shiftpolicyData.companyShiftId[rotationIndex]) {
                        status = shiftpolicyData.companyShiftId[rotationIndex].name;
                    }
                }
                //@ts-ignore
                report.push({ date, status });
            
                startDate = startDate.add(1, 'day');
            }
        
            resolve({ report, user: each });
        });
        });
  
        return Promise.all(promises);
    }
  }

  export default generateShiftReport;