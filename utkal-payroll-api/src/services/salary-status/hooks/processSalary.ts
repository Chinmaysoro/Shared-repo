
import { clearGlobalAppDefaultCred } from 'firebase-admin/lib/app/credential-factory';
import { Application } from '../../../declarations';
import { calculateSalary } from '../../../hooks/calculateSalary';

export const processSalary = async(app :Application, payload: any , salaryStatus: any): Promise<void> =>{

    try{
        console.log("mkr1");
        
        const { companyId, month, year, userIds } = payload;

        if(userIds.length){

            const payslips  = await app.service('v1/payslip')._find({
                query: {
                    companyId,
                    userIds,
                    month,
                    year,
                    salaryStatus:'unprocessed',
                    paybleDays:{$ne: null},
                    totalPaybleDays:{$ne: null}
                },
                paginate: false,
            });
            console.log("Payslip",payslips);

            if(payslips.length){

                let totalProcessPayout = 0;

                for await (const payslip of payslips){
                    if(payslip?.paybleDays && payslip?.totalPaybleDays){
                        const components = await calculateSalary(app, payslip.userId, payslip.paybleDays, payslip.totalPaybleDays);
                        // console.log( payslip.userId, components);
                        if(components.status){
                            const updateObj: any = {
                                monthlyPay: components.monthlyPay,
                                totalPayable: components.totalPayable,
                                payComponents: components.salaryBreakDown,
                                payGroupId: components.payGroup._id,
                                payGroupName: components.payGroup.name,
                                monthlyCTC: components.annualCTC/12,
                                annualCTC: components.annualCTC
                            };
    
                            if(userIds.includes(payslip.userId.toString())){
                                updateObj['isProcessed'] = true;
                                updateObj['salaryStatus'] = 'processed';
                                totalProcessPayout = totalProcessPayout + updateObj.totalPayable;
                            }else{
                                updateObj['isProcessed'] = false;
                            }
                            // console.log( payslip.userId, updateObj);

                            await app.service('v1/payslip')._patch(payslip._id,updateObj);
    
                        }
                        // console.log('>>>>',totalProcessPayout);

                    }
                    
                }

                // console.log(totalProcessPayout);

                const statusObj = {
                    $inc:{
                        totalProcessPayout: totalProcessPayout
                    }
                }

                if(salaryStatus.salaryStatus === 'processing'){
                   statusObj['salaryStatus'] = 'processed';
                }

                await app.service('v1/salary-status')._patch(salaryStatus._id,statusObj );

            }
        }
       


    }catch(err){
       console.log('error in salary process / salary calculate',err);
    }
};

export const releaseSalary = async(app :Application, payload: any , salaryStatus: any ): Promise<void> =>{

    try{
        const { companyId, month, year, userIds, action, paymentMethod } = payload;

        if(userIds.length){

            const payslips  = await app.service('v1/payslip')._find({
                query: {
                    companyId,
                    userIds,
                    month,
                    year,
                    isProcessed: true,
                    salaryStatus: { $in: ['processing', 'processed', 'hold']},
                    userId:{ $in: userIds}
                },
                paginate: false,
            });
            console.log(payslips.length);

            if(payslips.length){

                let totalReleasePayout = 0;
                let noOfHoldEmployee = 0;

                for await (const payslip of payslips){
                    const updateObj: any = {
                        salaryStatus: 'released',
                        paymentMethod,
                    };

                    if(payslip.salaryStatus === 'hold'){
                        noOfHoldEmployee++;
                    }

                    
                    totalReleasePayout = totalReleasePayout + payslip.totalPayable;
                    
                    // console.log( payslip.userId, updateObj);

                    await app.service('v1/payslip')._patch(payslip._id,updateObj);

                    
                }

                // console.log(totalProcessPayout);
                await app.service('v1/salary-status')._patch(salaryStatus._id,
                    {
                        salaryStatus: 'released',
                        noOfReleasedEmployee: payslips.length,
                        totalReleasePayout: totalReleasePayout,

                        $inc: {
                            totalReleasePayout: totalReleasePayout,
                            noOfReleasedEmployee: payslips.length,
                            noOfHoldEmployee : -noOfHoldEmployee
                        },
                    }
                );

            }
        }
       


    }catch(err){
       console.log('error in salary release',err);
    }
};

export const holdSalary = async(app :Application, payload: any , salaryStatus: any): Promise<void> =>{

    try{
        const { companyId, month, year, userIds } = payload;

        if(userIds.length){

            const payslips  = await app.service('v1/payslip')._find({
                query: {
                    companyId,
                    userIds,
                    month,
                    year,
                    isProcessed: true,
                    salaryStatus: { $in: ['processing', 'processed']},
                    userId:{ $in: userIds}
                },
                paginate: false,
            });
            console.log(payslips.length);

            if(payslips.length){

                for await (const payslip of payslips){
                    const updateObj: any = {
                        salaryStatus: 'hold',
                    };
                    
                    console.log( payslip.userId, updateObj);

                    await app.service('v1/payslip')._patch(payslip._id,updateObj);

                    
                }

                // console.log(totalProcessPayout);
                await app.service('v1/salary-status')._patch(salaryStatus._id,
                    {
                        salaryStatus: 'released',
                        $inc: {
                            noOfHoldEmployee: payslips.length
                        },
                    }
                );

            }
        }
       


    }catch(err){
       console.log('error in salary hold',err);
    }
};

export const unprocessSalary = async(app :Application, payload: any , salaryStatus: any): Promise<void> =>{

    try{
        const { companyId, month, year, userIds } = payload;

        if(userIds.length){

            const payslips  = await app.service('v1/payslip')._find({
                query: {
                    companyId,
                    userIds,
                    month,
                    year,
                    isProcessed: true,
                    salaryStatus: { $in: ['processed']},
                    userId:{ $in: userIds}
                },
                paginate: false,
            });
            console.log(payslips.length);

            if(payslips.length){
                let totalProcessPayout=0;

                for await (const payslip of payslips){
                    const updateObj: any = {
                        salaryStatus: 'unprocessed'
                    };
                    
                    // console.log( payslip.userId, updateObj);
                    totalProcessPayout = totalProcessPayout + payslip.totalPayable;
                    await app.service('v1/payslip')._patch(payslip._id,updateObj);

                    
                }

                // console.log(totalProcessPayout);
                await app.service('v1/salary-status')._patch(salaryStatus._id,
                    {
                        // salaryStatus: 'released',
                        $inc: {
                            totalProcessPayout: -totalProcessPayout
                        },
                    }
                );

            }
        }
       


    }catch(err){
       console.log('error in salary hold',err);
    }
};

export const publishSalary = async(app :Application, payload: any , salaryStatus: any): Promise<void> =>{

    try{
        const { companyId, month, year, userIds } = payload;

        if(userIds.length){

            const payslips  = await app.service('v1/payslip')._find({
                query: {
                    companyId,
                    userIds,
                    month,
                    year,
                    isProcessed: true,
                    salaryStatus: { $in: ['released']},
                    userId:{ $in: userIds}
                },
                paginate: false,
            });
            console.log(payslips.length);

            if(payslips.length){
                // let totalProcessPayout=0;

                for await (const payslip of payslips){
                    const updateObj: any = {
                        salaryStatus: 'published'
                    };
                    
                    // console.log( payslip.userId, updateObj);
                    // totalProcessPayout = totalProcessPayout + payslip.totalPayable;
                    await app.service('v1/payslip')._patch(payslip._id,updateObj);

                    
                }

                // console.log(totalProcessPayout);
                await app.service('v1/salary-status')._patch(salaryStatus._id,
                    {
                        salaryStatus: 'published',
                    }
                );

            }
        }
       


    }catch(err){
       console.log('error in salary hold',err);
    }
};