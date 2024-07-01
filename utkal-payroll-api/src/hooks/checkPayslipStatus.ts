
import { Hook, HookContext } from '@feathersjs/feathers';
import {BadRequest} from "@feathersjs/errors";

const checkPayslipStatus = (): Hook => async (context: HookContext): Promise<HookContext> => {
  const {data, app, params, id} = context;
//   console.log(context.path);

  const attendanceData = await app.service(context.path)._get(id);
//   console.log(attendanceData);
  const targetDate = new Date(data.attendanceDate || data.startDate) // handle for attendance or leave
  const payslipService = app.service('v1/payslip');

  const payslipData = await payslipService._find({
    query:{
      userId: attendanceData.createdBy,
      companyId: attendanceData?.companyId,
      month: context.path === 'v1/leave' ? targetDate.getMonth()+1 : targetDate.getMonth(),
      year: targetDate.getFullYear()
    }
  })
//   console.log(payslipData);
  if(payslipData.data.length > 0 && payslipData.data[0].salaryStatus!== 'unprocessed'){
    throw new BadRequest(" Salary is already procossed ");
  }
  return context;
};

export default checkPayslipStatus;
