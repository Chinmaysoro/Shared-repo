// Initializes the `user-salary` service on path `/user-salary`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { UserSalary } from './user-salary.class';
import createModel from '../../models/user-salary.model';
import hooks from './user-salary.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/user-salary': UserSalary & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
    multi: ['patch','create']
  };

  // Initialize our service with any options it requires
  app.use('/v1/user-salary', new UserSalary(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/user-salary');

  service.hooks(hooks);
}
