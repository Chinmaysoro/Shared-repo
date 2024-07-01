// Initializes the `reimbursement-type` service on path `/reimbursement-type`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ReimbursementType } from './reimbursement-type.class';
import createModel from '../../models/reimbursement-type.model';
import hooks from './reimbursement-type.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/reimbursement-type': ReimbursementType & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/reimbursement-type', new ReimbursementType(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/reimbursement-type');

  service.hooks(hooks);
}
