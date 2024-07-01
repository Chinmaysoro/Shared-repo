// Initializes the `firebase-notification` service on path `/firebase-notification`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { FirebaseNotification } from './firebase-notification.class';
import hooks from './firebase-notification.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/firebase-notification': FirebaseNotification & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/firebase-notification', new FirebaseNotification(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/firebase-notification');

  service.hooks(hooks);
}
