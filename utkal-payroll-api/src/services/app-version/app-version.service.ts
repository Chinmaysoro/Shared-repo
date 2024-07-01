// Initializes the `v1/app-version` service on path `/v1/app-version`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AppVersion } from './app-version.class';
import createModel from '../../models/app-version.model';
import hooks from './app-version.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/app-version': AppVersion & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/app-version', new AppVersion(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/app-version');

  service.hooks(hooks);
}
