import { Hook, HookContext } from '@feathersjs/feathers';

const removeAuthenticate =
  (): Hook =>
    async (context: HookContext): Promise<HookContext> => {
      const {  result } = context;

      delete result.authentication;

      return context;
    };
export default removeAuthenticate;
