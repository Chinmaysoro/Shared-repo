// Initializes the `pay-components` service on path `/pay-components`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PayComponents } from './pay-components.class';
import createModel from '../../models/pay-components.model';
import hooks from './pay-components.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/pay-components': PayComponents & ServiceAddons<any>;
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
  app.use('/v1/pay-components', new PayComponents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/pay-components');

  service.hooks(hooks);
}
