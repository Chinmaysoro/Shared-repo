// Initializes the `call-details` service on path `/call-details`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CallDetails } from './call-details.class';
import createModel from '../../models/call-details.model';
import hooks from './call-details.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/call-details': CallDetails & ServiceAddons<any>;
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
  app.use('/v1/call-details', new CallDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/call-details');

  service.hooks(hooks);
}
