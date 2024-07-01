// Initializes the `leave-policy` service on path `/leave-policy`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { LeavePolicy } from './leave-policy.class';
import createModel from '../../models/leave-policy.model';
import hooks from './leave-policy.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/leave-policy': LeavePolicy & ServiceAddons<any>;
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
  app.use('/v1/leave-policy', new LeavePolicy(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/leave-policy');

  service.hooks(hooks);
}
