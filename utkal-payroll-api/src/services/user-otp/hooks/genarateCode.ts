import { Hook, HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import EmailOTP from '../../../template/EmailOTP';
import sendMail from '../../../hooks/sendmail';
import sendMessage from '../../../hooks/sendMessage';

export const genarateCode =
  (): Hook =>
    async (context: HookContext): Promise<HookContext> => {
      const { app, data } = context;

      const service = app.service('v1/users');

      const { phone, email } = data;

      let query = {};

      if (phone) {
        query = {
          phone: phone,
        };
      } else if (email) {
        query = {
          email: email,
        };
      }

      const [user] = await service._find({
        query: query,
        paginate: false,
      });
      if (!user) throw new BadRequest('User not found', { key: 'USER_NOT_FOUND' });

      const code = Math.floor(Math.random() * 899999 + 100000);
      if (email) {
        const options = {
          to: data.email,
          subject: 'OTP for Login',
          text: EmailOTP.render({
            firstName: user.firstName,
            otp: code,
          }),
        };
        await sendMail(app, options);
      }else if(phone){
        await sendMessage(app,{to: '+91'+phone, text: code})
      }

      context.data = {
        code: code,
        userId: user._id,
      };

      return context;
    };
