import { Hook, HookContext } from '@feathersjs/feathers';

const setCompany =
	(fieldName = 'companyId'): Hook =>
	  (context: HookContext): HookContext => {
	    const { user } = context.params;
	    if (typeof context.params.provider === 'undefined') return context;
	    if (Array.isArray(context.data)) {
	      context.data.map((each: string) => {
	        each[fieldName] = user?.companyId;
	      });
	    } else {
	      context.data[fieldName] = user?.companyId;
	    }
	    return context;
	  };

export default setCompany;
