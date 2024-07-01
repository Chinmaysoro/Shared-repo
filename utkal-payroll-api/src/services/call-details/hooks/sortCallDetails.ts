import { Hook, HookContext } from '@feathersjs/feathers';

const sortCallDetails =
  (): Hook =>
    async (context: HookContext): Promise<HookContext> => {
      const {query} = context?.params;
      // @ts-ignore
      if(!query['$sort']) query.$sort = {dateTime: -1}
      return context;
    };

export default sortCallDetails;
