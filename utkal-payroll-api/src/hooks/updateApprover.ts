import { Hook, HookContext } from '@feathersjs/feathers';

const updateApprover = (): Hook =>
    (context: HookContext): HookContext => {
      const { user } = context.params;
      if (typeof context.params.provider === 'undefined') return context;

      return context;
    };

export default updateApprover;
 
