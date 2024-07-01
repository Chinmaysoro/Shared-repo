// Initializes the `user-documents` service on path `/user-documents`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { UserDocuments } from './user-documents.class';
import createModel from '../../models/user-documents.model';
import hooks from './user-documents.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/user-documents': UserDocuments & ServiceAddons<any>;
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
  app.use('/v1/user-documents', new UserDocuments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/user-documents');

  service.hooks(hooks);
}
