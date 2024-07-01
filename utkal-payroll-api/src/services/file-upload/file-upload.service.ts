// Initializes the `file-upload` service on path `/file-upload`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { FileUpload } from './file-upload.class';
import hooks from './file-upload.hooks';
import multer from 'multer';


// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/file-upload': FileUpload & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
    multi: true,
  };
  const multipartMiddleware = multer();

  // Initialize our service with any options it requires

  // Initialize our service with any options it requires
  app.use('/v1/file-upload', multipartMiddleware.single('uri'),
    function (req, res, next) {
      req.feathers.files = req.file.buffer;
      next();
    }, new FileUpload(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/file-upload');

  service.hooks(hooks);
}
