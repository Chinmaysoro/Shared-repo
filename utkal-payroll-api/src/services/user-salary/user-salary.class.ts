import { NullableId, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';
import { calculateSalaryStructure } from '../../hooks/calculateSalary';
import {IUserSalary} from "../../interfaces/models/user-salary";

interface SalaryStructure {
  name: string;
  type: string;
  value: number;
  valueType: string;
  monthlyValue:number;
}
export class UserSalary extends Service {
  app: Application;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars

  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async find(params?: Params): Promise<any> {
    // console.log(params);
    const result: any = await super.find(params);

    if(params?.query?.userId && result?.data?.length === 1){
      const payGroupComponents  = await this.app.service('v1/pay-group').find({
          query: {
            _id: result.data[0].payGroupId,
            $populate: {
              path: 'components.component',
              select: 'name type', // Include only the necessary fields
            },
          },
          paginate: false,
          lean: true,
        });
      const salaryStructure = calculateSalaryStructure(result.data[0].annualCTC, payGroupComponents[0].components);
      return { ...result, data:[{
        ...result.data[0],
        monthlyCtc:result.data[0].annualCTC/12,salaryStructure 
      }]};

    }
    return result;
  }

  async create(data: IUserSalary , params?: Params): Promise<Record<string, any>> {
    
    // console.log(data);
    const [salaryData, payGroupComponents]  = await Promise.all([
      this.app.service('v1/user-salary').find({
        query: {
          userId: data.userId
        },
        paginate: false,
      }) as Promise<any[]>,
      this.app.service('v1/pay-group').find({
        query: {
          _id: data.payGroupId,
          $populate: {
            path: 'components.component',
            select: 'name type', // Include only the necessary fields
          },
        },
        paginate: false,
        lean: true,
      })
    ]);
    // console.log(payGroupComponents,salaryData);

    let userSalary: IUserSalary;

    if(salaryData.length){
      userSalary = await super.patch(salaryData[0]._id, data, params);
      
    }else{
      userSalary = await super.create(data, params);
      
    }

    const salaryStructure = calculateSalaryStructure(data.annualCTC, payGroupComponents[0].components);
    return { ...userSalary, monthlyCtc:data.annualCTC/12,salaryStructure };

  }

  // calculateSalaryStructure = (ctc: number, components: any): SalaryStructure[] =>{
  //   try{
  //     const values = {};

  //     const replaceIdsWithValues = (formula) => {
  //       // Replace each component ID with its name in the formula
  //       const ctcRegex = new RegExp(`\\bCTC\\b`, 'g');
  //       formula = formula.replace(ctcRegex, ctc);

  //       components.forEach(component => {
  //         const idRegex = new RegExp(`\\b${component.component._id}\\b`, 'g');
  //         formula = formula.replace(idRegex, values[component.component._id]);
  //       });
      
  //       return formula;
  //     }

  //     const getComponentValue = (component) => {
  //       if (component.type === 'formula') {
  //         if (values[component.component._id] !== undefined) {
  //           return values[component.component._id];
  //         }
    
  //         const calculatedValue = eval(replaceIdsWithValues(component.formula));
  //         values[component.component._id] = calculatedValue;
  //         return calculatedValue;
  //       } else if (component.type === 'fixed') {
  //         return component.value;
  //       }
  //     };

    
  //     const payslip:SalaryStructure[]  = components.map(component => {
  //       const yearValue = getComponentValue(component);
  //       return {
  //         name: component.component.name,
  //         type: component.component.type,
  //         value: yearValue,
  //         valueType: component.type,
  //         monthlyValue: yearValue/12,
  //         formula: component.formula
  //       }
  //     })
    
  //     const othersValue = ctc - payslip.reduce((total, component) => total + component.value, 0);
  //     payslip.push({ name: 'Others', type: 'addition', value: othersValue, valueType: 'fixed', monthlyValue: othersValue/12 });
    
  //     return payslip;
  //   }catch(err){
  //     console.log(err);
  //     return []
  //   }
    
  // };
}
