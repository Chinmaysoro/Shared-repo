import { Hook, HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';

const sendInvitation =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { data, app, params } = context;
    const { user } = params;


		return context;
	};

export default sendInvitation;
