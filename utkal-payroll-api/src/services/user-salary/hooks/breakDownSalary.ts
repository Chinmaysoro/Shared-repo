import { Hook, HookContext } from '@feathersjs/feathers';

const breakDownSalary =
  (): Hook =>
    async (context: HookContext): Promise<HookContext> => {
      const { app, data } = context;
      const { payGroupId, monthlyCTC, annualCTC } = data;
      const payComponentService = app.service('v1/pay-components');

      let monthlySalaryBreakDown= {}
      let annualSalaryBreakDown= {}
      if (payGroupId && monthlyCTC) {
        const payComponentData = await payComponentService.find({query: {
            payGroupId: payGroupId,
            $populate: ['salaryComponentId'],
          }})
        if(payComponentData.data.length > 0){
          let totalFixedAmt = 0;
          await payComponentData.data.map(e => e?.payComponentsType === "fixAmount"? totalFixedAmt = totalFixedAmt + parseInt(e.fixedAmount) : totalFixedAmt = totalFixedAmt + 0)
          payComponentData.data.map(each => {
            if(each?.payComponentsType === "percentage"){
              monthlySalaryBreakDown[each.salaryComponentId.name] = parseInt(each.percentage) / 100 * (monthlyCTC - totalFixedAmt);
            }
            if(each?.payComponentsType === "fixAmount"){
              monthlySalaryBreakDown[each?.salaryComponentId?.name] = parseInt(each.fixedAmount);
            }
          })
        }
      }
      if (payGroupId && annualCTC) {
        const payComponentData = await payComponentService.find({query: {
            payGroupId: payGroupId,
            $populate: ['salaryComponentId'],
          }})
        if(payComponentData.data.length > 0){
          let totalFixedAmt = 0;
            await payComponentData.data.map(e => e?.payComponentsType === "fixAmount"? totalFixedAmt = totalFixedAmt + parseInt(e.fixedAmount) : totalFixedAmt = totalFixedAmt + 0)
            payComponentData.data.map(each => {
            if(each?.payComponentsType === "percentage"){
              annualSalaryBreakDown[each.salaryComponentId.name] = parseInt(each.percentage) / 100 * (annualCTC - totalFixedAmt* 12);
            }
            if(each?.payComponentsType === "fixAmount"){
              annualSalaryBreakDown[each?.salaryComponentId?.name] = parseInt(each.fixedAmount) * 12;
            }
          })
        }
      }
      data.monthlySalaryBreakDown = monthlySalaryBreakDown
      data.annualSalaryBreakDown = annualSalaryBreakDown

      return context;
    };

export default breakDownSalary;
