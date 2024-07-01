import { Hook, HookContext } from '@feathersjs/feathers';

const createDepartment =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { app, data } = context;
		const { parentId } = data;
		const companyService = app.service('v1/department');

		if (parentId) {
			await companyService._patch(parentId, {
				hasChild: true,
			});
		}

		return context;
	};

export default createDepartment;
