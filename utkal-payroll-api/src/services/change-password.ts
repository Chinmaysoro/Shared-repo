import { BadRequest } from '@feathersjs/errors';
import * as authentication from '@feathersjs/authentication';
const { authenticate } = authentication.hooks;
const changePassword = (app) => {
  app.use('/v1/change-password', {
    async create(data,params) {
      console.log(params);
      const { user } = params;
      const { oldPassword, newPassword, confirmPassword,userId  } = data;
      const userService = app.service('v1/users');

      if (!oldPassword || !newPassword || !confirmPassword){
        throw new BadRequest('Password Should not be empty!!!');
        // return ;
      }

      if (newPassword == oldPassword){
        throw new BadRequest('Old-password and new-password should not be same');
        // return ;
      }

      // if (!newPassword) return;
      if(user.role !== 65535 || user.role !== 32767){
        if (userId.toString() !== user._id.toString()) {
          throw new BadRequest('You cannot change password of other user!');
        }
      }


      if (!newPassword || !confirmPassword) {
        throw new BadRequest('New Password and confirm password are required!');
      }

      if (newPassword !== confirmPassword) {
        throw new BadRequest('New Password and confirm password are not equal!');
      }
      if (user) {
        await userService.patch(user._id, {
          password: newPassword,
        });

        return { message: 'Password updated successfully' };
      }

    },
  });

  const service = app.service('v1/change-password');



  service.hooks({
    before: {
      create: [authenticate('jwt')],
    },
    after: {
      create: [],
    },
  });
};
export default changePassword;
