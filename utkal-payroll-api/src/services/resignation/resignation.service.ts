// Initializes the `resignation` service on path `/resignation`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Resignation } from './resignation.class';
import createModel from '../../models/resignation.model';
import hooks from './resignation.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/resignation': Resignation & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/resignation', new Resignation(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/resignation');

  service.hooks(hooks);
}
