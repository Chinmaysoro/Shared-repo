import admin from 'firebase-admin';
const serviceAccount = require('../../../../config/firebase.json'); // Replace with your own path

import { Hook, HookContext } from '@feathersjs/feathers';

const sendNotification =
  (): Hook =>
    (context: HookContext): HookContext => {
      const { data } = context;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      const message = {
        notification: {
          title: data.title,
          body: data.body,
        },
        token: data.token, // Replace with the recipient's registration token
      };

      admin.messaging().send(message)
        .then((response) => {
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
      return context;
    };

export default sendNotification;
