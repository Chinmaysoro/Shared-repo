// Initializes the `leave` service on path `/leave`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Leave } from './leave.class';
import createModel from '../../models/leave.model';
import hooks from './leave.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/leave': Leave & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/leave', new Leave(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/leave');

  service.hooks(hooks);
}
