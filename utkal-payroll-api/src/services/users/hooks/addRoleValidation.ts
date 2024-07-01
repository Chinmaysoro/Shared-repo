import { Hook, HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';

const addRoleValidation =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { data, app, params } = context;
    const { user } = params;
    if(data.role === 1 || data.role === 5 && user?.role === 32767){
      throw new BadRequest("you are not authorised to add company user")
    }
    if(data.role === 32767 && user?.role !== 65535){
      throw new BadRequest("you are not authorised to add company Admin")
    }

		return context;
	};

export default addRoleValidation;
