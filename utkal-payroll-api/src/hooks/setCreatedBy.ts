import { Hook, HookContext } from '@feathersjs/feathers';

const setCreatedBy =
	(fieldName = 'createdBy'): Hook =>
	  (context: HookContext): HookContext => {
	    const { user } = context.params;
	    if (typeof context.params.provider === 'undefined') return context;
	    if (Array.isArray(context.data)) {
	      context.data.map((each: string) => {
	        each[fieldName] = user?._id;
	      });
	    } else {
	      context.data[fieldName] = user?._id;
	    }
	    return context;
	  };

export default setCreatedBy;
