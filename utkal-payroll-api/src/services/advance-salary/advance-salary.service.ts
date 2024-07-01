// Initializes the `advance-salary` service on path `/advance-salary`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AdvanceSalary } from './advance-salary.class';
import createModel from '../../models/advance-salary.model';
import hooks from './advance-salary.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/advance-salary': AdvanceSalary & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate']
  };

  // Initialize our service with any options it requires
  app.use('/v1/advance-salary', new AdvanceSalary(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/advance-salary');

  service.hooks(hooks);
}
