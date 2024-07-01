// Initializes the `approval` service on path `/approval`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Approval } from './approval.class';
import createModel from '../../models/approval.model';
import hooks from './approval.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/approval': Approval & ServiceAddons<any>;
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
  app.use('/v1/approval', new Approval(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/approval');

  service.hooks(hooks);
}
