// Initializes the `resignation-type` service on path `/resignation-type`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ResignationType } from './resignation-type.class';
import createModel from '../../models/resignation-type.model';
import hooks from './resignation-type.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/resignation-type': ResignationType & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/resignation-type', new ResignationType(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/resignation-type');

  service.hooks(hooks);
}
