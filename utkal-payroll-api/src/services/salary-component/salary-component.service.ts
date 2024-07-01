// Initializes the `salary-component` service on path `/salary-component`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { SalaryComponent } from './salary-component.class';
import createModel from '../../models/salary-component.model';
import hooks from './salary-component.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/salary-component': SalaryComponent & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/salary-component', new SalaryComponent(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/salary-component');

  service.hooks(hooks);
}
