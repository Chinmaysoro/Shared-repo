// Initializes the `dashboard-filter` service on path `/dashboard-filter`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { DashboardFilter } from './dashboard-filter.class';
import hooks from './dashboard-filter.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/dashboard-filter': DashboardFilter & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/dashboard-filter', new DashboardFilter(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/dashboard-filter');

  service.hooks(hooks);
}
