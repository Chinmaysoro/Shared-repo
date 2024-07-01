// Initializes the `payslip` service on path `/payslip`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Payslip } from './payslip.class';
import createModel from '../../models/payslip.model';
import hooks from './payslip.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/payslip': Payslip & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/payslip', new Payslip(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/payslip');

  service.hooks(hooks);
}
