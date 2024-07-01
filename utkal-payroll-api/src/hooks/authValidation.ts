import { Hook, HookContext } from '@feathersjs/feathers';
import {BadRequest} from "@feathersjs/errors";

const authValidation =
  (): Hook =>
    async (context: HookContext): Promise<HookContext> => {
      const {  data, app } = context;
      const userService = app.service("v1/users");
      const userData = await userService.find({query: {email: data.email, status: 'active'}});
      // console.log("userData:---",userData);
      
      // if(!userData){
      //   console.log("User not found");
      // }

      // if(userData.data.length === 0){
      //   throw new BadRequest('You are not authorised to login');
      // }
      // if(userData.data[0].role  === 1 && data.source === 'web'){
      //   throw new BadRequest('You are not authorised to login');
      // }
      // if(userData.data[0].role  !== 1 && data.source === 'app'){
      //   throw new BadRequest('You are not authorised to login');
      // }
      return context;
    };
export default authValidation;
