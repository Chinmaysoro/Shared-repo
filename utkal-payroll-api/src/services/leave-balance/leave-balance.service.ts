// Initializes the `leave-balance` service on path `/leave-balance`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { LeaveBalance } from './leave-balance.class';
import createModel from '../../models/leave-balance.model';
import hooks from './leave-balance.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/leave-balance': LeaveBalance & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate']
  };

  // Initialize our service with any options it requires
  app.use('/v1/leave-balance', new LeaveBalance(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/leave-balance');

  service.hooks(hooks);
}
