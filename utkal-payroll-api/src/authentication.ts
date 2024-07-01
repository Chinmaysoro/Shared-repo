import { ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';

import { Application } from './declarations';
import removeAuthenticate from './hooks/removeAuthenticate';
import {NotAuthenticated} from "@feathersjs/errors";
import authValidation from "./hooks/authValidation";

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const authentication = new AuthenticationService(app);

  class CodeOrOTP extends LocalStrategy {
    async comparePassword(user:any, code: any) {
      const authCodeService = app.service('v1/user-otp');
      // @ts-ignore
      const authCode = await authCodeService._find({
        query: {
          userId: user?._id,
          $sort: {
            createdAt: -1
          }
        },
        paginate: false
      });

      if (authCode[0] && authCode[0].code === code) {
        // @ts-ignore
        await authCodeService._remove(authCode[0]._id);
        return user;
      }

      throw new NotAuthenticated('Invalid OTP', {
        key: 'INVALID_CODE'
      });
    }
  }


  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('local-phone', new CodeOrOTP());
  authentication.register('local-email', new CodeOrOTP());
  authentication.register('local-code', new LocalStrategy());


  app.use('/v1/authentication', authentication);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.service('v1/authentication').hooks({
    before: {
      create: [authValidation()],
    },
    after: {
      create: [removeAuthenticate()],
    },
  });
  app.configure(expressOauth());
}
