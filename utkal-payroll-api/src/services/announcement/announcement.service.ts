// Initializes the `announcement` service on path `/announcement`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Announcement } from './announcement.class';
import createModel from '../../models/announcement.model';
import hooks from './announcement.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/announcement': Announcement & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate'],
  };

  // Initialize our service with any options it requires
  app.use('/v1/announcement', new Announcement(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/announcement');

  service.hooks(hooks);
}
