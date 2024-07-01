// Initializes the `leave-type` service on path `/leave-type`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { LeaveType } from './leave-type.class';
import createModel from '../../models/leave-type.model';
import hooks from './leave-type.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/leave-type': LeaveType & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/leave-type', new LeaveType(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/leave-type');

  service.hooks(hooks);
}
