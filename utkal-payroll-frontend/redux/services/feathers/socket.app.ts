import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import { CookieStorage } from 'cookie-storage';
import io from 'socket.io-client';
import services from './services.json';

export const authCookieName = 'candidatetkt';

/**
 * CookieStorage
 * @type {CookieStorage}
 */
export const cookieStorage = new CookieStorage();

const socket = io('https://candidateapi.personifwy.com/');
// const socket = io('http://localhost:3030/');

/**
 * Feathers application
 * @type {createApplication.Application<any>}
 */
const socketApp = feathers();

// socketApp.configure(restClient.axios(Axios));
socketApp.configure(socketio(socket));

socketApp.configure(
	auth({
		path: services.authentication,
		// cookie: process.env.NEXT_COOKIE_NAME,
		// @ts-ignore
		cookie: authCookieName,
		// storageKey: process.env.NEXT_COOKIE_NAME,
		storageKey: authCookieName,
		storage: cookieStorage,
	}),
);

export default socketApp;
