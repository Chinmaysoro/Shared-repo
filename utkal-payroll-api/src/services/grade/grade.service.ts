// Initializes the `grade` service on path `/grade`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Grade } from './grade.class';
import createModel from '../../models/grade.model';
import hooks from './grade.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/grade': Grade & ServiceAddons<any>;
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
  app.use('/v1/grade', new Grade(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/grade');

  service.hooks(hooks);
}
