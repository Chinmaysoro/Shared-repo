

import { Application } from '../declarations';

interface SalaryStructure {
    name: string;
    type: string;
    value: number;
    valueType: string;
    monthlyValue:number;
  }

export const calculateSalary = async(app :Application, userId: string, days: number, totalDays: number ): Promise<any> =>{

    try{
        // const { companyId, userId } = payload;

        //fetch paygroup 
        //calculate salary for the user
        // console.log('hhhhhhhhhh',userId);
        const userSalary  = await app.service('v1/user-salary')._find({
            query: {
                // companyId,
                userId
            },
            paginate: false,
          });

          if(userSalary.length){
            // console.log('userslaary',userSalary[0]._id);
            const payGroup = await app.service('v1/pay-group')._find({
                query: {
                    _id: userSalary[0].payGroupId,
                    $populate: {
                        path: 'components.component',
                        select: 'name type', // Include only the necessary fields
                    },
                },
                paginate: false,
              });
    
            if(payGroup.length && payGroup[0].components?.length){
                // console.log('paygroup',payGroup[0]._id);
                const salaryBreakDown = calculateSalaryStructure(userSalary[0].annualCTC, payGroup[0].components);
                const paybleObj = salaryBreakDown.map(each => {
                    return {
                        name : each.name,
                        type: each.type,
                        monthlyValue: each.monthlyValue,
                        actualValue: (each.monthlyValue/totalDays) * days
                    }
                });

                const totalDeduction = paybleObj.reduce((sum, item: any) => {
                    // Check if the item is of type "deduction"
                    if (item.type === 'deduction') {
                      // Accumulate the actual value for deduction
                      sum += item.actualValue;
                    }
                    return sum;
                  }, 0);
                  const monthlyPay = ((userSalary[0].annualCTC/12)/totalDays) * days
                //   console.log('Total Deduction:', totalDeduction);
                return { status: true,  monthlyPay , totalPayable: monthlyPay - totalDeduction, salaryBreakDown: paybleObj, payGroup: payGroup[0], annualCTC: userSalary[0].annualCTC}
            } 
          }

          return { status: false}

       


    }catch(err){
       console.log('error in salary process / salary calculate',err);
    }
};

export const calculateSalaryStructure = (ctc: number, components: any): SalaryStructure[] =>{
    try{
      const values = {};

      const replaceIdsWithValues = (formula) => {
        // Replace each component ID with its name in the formula
        const ctcRegex = new RegExp(`\\bCTC\\b`, 'g');
        formula = formula.replace(ctcRegex, ctc);

        components.forEach(component => {
          const idRegex = new RegExp(`\\b${component.component._id}\\b`, 'g');
          formula = formula.replace(idRegex, values[component.component._id]);
        });
      
        return formula;
      }

      const getComponentValue = (component) => {
        // console.log(values);
        if (component.type === 'formula') {
          if (values[component.component._id] !== undefined) {
            return values[component.component._id];
          }
    
          const calculatedValue = eval(replaceIdsWithValues(component.formula));
          values[component.component._id] = calculatedValue;
          return calculatedValue;
        } else if (component.type === 'fixed') {
            values[component.component._id] = component.value;
          return component.value;
        }
      };

    
      const payslip:SalaryStructure[]  = components.map(component => {
        const yearValue = getComponentValue(component);
        return {
          name: component.component.name,
          type: component.component.type,
          value: yearValue,
          valueType: component.type,
          monthlyValue: yearValue/12,
          formula: component.formula
        }
      })
    
      const othersValue = ctc - payslip.reduce((total, component) => total + component.value, 0);
      payslip.push({ name: 'Others', type: 'addition', value: othersValue, valueType: 'fixed', monthlyValue: othersValue/12 });
    
      return payslip;
    }catch(err){
      console.log("Calc Salary structure:-",err);
      return []
    }
    
  };