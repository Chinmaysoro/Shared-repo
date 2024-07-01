import { Hook, HookContext } from '@feathersjs/feathers';

const getAllChildDepartment =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { params } = context;
		const { query } = params;
		if (query?.childDepartment  === 'true' && !query?.parentId) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			query?.parentId = {
				$ne: null,
			};
			delete query.childDepartment;
		} else if (query?.childDepartment === 'true') {
			delete query.childDepartment;
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			query?.parentId = null;
		}

		return context;
	};

export default getAllChildDepartment;
