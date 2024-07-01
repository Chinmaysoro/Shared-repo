// Initializes the `Attendance` service on path `/attendance`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Attendance } from './attendance.class';
import createModel from '../../models/attendance.model';
import hooks from './attendance.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/attendance': Attendance & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate', '$exists'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/attendance', new Attendance(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/attendance');

  service.hooks(hooks);
}
