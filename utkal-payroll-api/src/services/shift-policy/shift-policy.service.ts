// Initializes the `shift-policy` service on path `/shift-policy`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ShiftPolicy } from './shift-policy.class';
import createModel from '../../models/shift-policy.model';
import hooks from './shift-policy.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/shift-policy': ShiftPolicy & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate', '$exists'],
    multi: ['patch','create'],
 };

  // Initialize our service with any options it requires
  app.use('/v1/shift-policy', new ShiftPolicy(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/shift-policy');

  service.hooks(hooks);
}
