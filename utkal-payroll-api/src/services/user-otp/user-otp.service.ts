// Initializes the `user-otp` service on path `/user-otp`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { UserOtp } from './user-otp.class';
import createModel from '../../models/user-otp.model';
import hooks from './user-otp.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/user-otp': UserOtp & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/user-otp', new UserOtp(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/user-otp');

  service.hooks(hooks);
}
