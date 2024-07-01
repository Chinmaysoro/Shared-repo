// Initializes the `holiday-list` service on path `/holiday-list`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { HolidayList } from './holiday-list.class';
import createModel from '../../models/holiday-list.model';
import hooks from './holiday-list.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/holiday-list': HolidayList & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$populate']
  };

  // Initialize our service with any options it requires
  app.use('/v1/holiday-list', new HolidayList(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/holiday-list');

  service.hooks(hooks);
}
