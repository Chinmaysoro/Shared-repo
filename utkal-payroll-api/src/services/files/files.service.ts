// Initializes the `files` service on path `/files`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Files } from './files.class';
import createModel from '../../models/files.model';
import hooks from './files.hooks';
import multer from 'multer';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/files': Files & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
    multi: true,
  };

  const multipartMiddleware = multer();

  // Initialize our service with any options it requires
  app.use(
    '/v1/files',
    multipartMiddleware.single('uri'),
    function (req, res, next) {
      req.feathers.files = req.file;
      next();
    },
    new Files(options, app),
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/files');

  service.hooks(hooks);
}
