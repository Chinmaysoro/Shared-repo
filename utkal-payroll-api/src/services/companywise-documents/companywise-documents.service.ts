// Initializes the `companywise-documents` service on path `/companywise-documents`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CompanywiseDocuments } from './companywise-documents.class';
import createModel from '../../models/companywise-documents.model';
import hooks from './companywise-documents.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/companywise-documents': CompanywiseDocuments & ServiceAddons<any>;
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
  app.use('/v1/companywise-documents', new CompanywiseDocuments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/companywise-documents');

  service.hooks(hooks);
}
