// Initializes the `company` service on path `/company`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Company } from './company.class';
import createModel from '../../models/company.model';
import hooks from './company.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/company': Company & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
    multi: ['patch','create'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/company', new Company(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/company');

  service.hooks(hooks);
}
