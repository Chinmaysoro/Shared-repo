import { NullableId, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';
import { holdSalary, processSalary, publishSalary, releaseSalary, unprocessSalary } from './hooks/processSalary';


export class SalaryStatus extends Service {
  app: Application;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
   this.app = app;
  }
  async create(data: any , params?: Params): Promise<Record<string, any>> {

    const { companyId, month, year, action  } = data;
    // console.log(data);
    const [salaryStatuses]  = await Promise.all([
      this.app.service('v1/salary-status').find({
        query: {
          companyId,
          month,
          year
        },
        paginate: false,
      }) as Promise<any[]>
    ]);
    // // console.log(payGroupComponents,salaryData);

    let salaryStatus: any;

    if(salaryStatuses.length){
      // salaryStatus = await super.patch(salaryStatuses[0]._id, data, params);
      console.log("salary ==>",salaryStatus) 
      salaryStatus = salaryStatuses[0];
    }else{
      salaryStatus = await super.create(data, params);
      
    }

    if(action === 1){
      //process Salary
      processSalary(this.app, data, salaryStatus);

    }

    if(action === 2 ){
      //release salary
      releaseSalary(this.app, data, salaryStatus);

    }

    if(action === 3){
      //hold salary
      holdSalary(this.app, data, salaryStatus);

    }

    if(action === 4){
      //unprocess salary
      unprocessSalary(this.app, data, salaryStatus);

    }

    if(action === 5){
      //publish salary
      publishSalary(this.app, data, salaryStatus);

    }

    // const salaryStructure = this.calculateSalaryStructure(data.annualCTC, payGroupComponents[0].components);
    // return { ...userSalary, monthlyCtc:data.annualCTC/12,salaryStructure };

    return salaryStatus;
  }

  // async patch (id: NullableId, data: any, params?: Params): Promise<any> {
  //   return data;
  // }
}
