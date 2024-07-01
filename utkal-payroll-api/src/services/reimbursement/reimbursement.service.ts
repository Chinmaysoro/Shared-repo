// Initializes the `reimbursement` service on path `/reimbursement`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Reimbursement } from './reimbursement.class';
import createModel from '../../models/reimbursement.model';
import hooks from './reimbursement.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/reimbursement': Reimbursement & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/reimbursement', new Reimbursement(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/reimbursement');

  service.hooks(hooks);
}
