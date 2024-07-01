// Initializes the `company-shift` service on path `/company-shift`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CompanyShift } from './company-shift.class';
import createModel from '../../models/company-shift.model';
import hooks from './company-shift.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/company-shift': CompanyShift & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate']
  };

  // Initialize our service with any options it requires
  app.use('/v1/company-shift', new CompanyShift(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/company-shift');

  service.hooks(hooks);
}
