// Initializes the `designation` service on path `/designation`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Designation } from './designation.class';
import createModel from '../../models/designation.model';
import hooks from './designation.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/designation': Designation & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/designation', new Designation(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/designation');

  service.hooks(hooks);
}
