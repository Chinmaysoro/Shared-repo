// Initializes the `pay-group` service on path `/pay-group`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PayGroup } from './pay-group.class';
import createModel from '../../models/pay-group.model';
import hooks from './pay-group.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/pay-group': PayGroup & ServiceAddons<any>;
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
  app.use('/v1/pay-group', new PayGroup(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/pay-group');

  service.hooks(hooks);
}
