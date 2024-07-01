import { Hook, HookContext } from '@feathersjs/feathers';

const getAllChildCompany =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { params } = context;
		const { query } = params;
		if (query?.childCompany  === 'true' && !query?.parentId) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			query?.parentId = {
				$ne: null,
			};
			delete query.childCompany;
		} else if (query?.childCompany === 'true') {
			delete query.childCompany;
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			query?.parentId = null;
		}

		return context;
	};

export default getAllChildCompany;
