import { BadRequest } from '@feathersjs/errors';
import * as authentication from '@feathersjs/authentication';
const { authenticate } = authentication.hooks;

const quotes = (app) => {
  app.use('/v1/quotes', {
    async find(params) {
      const { user } = params;



      return {  };
    },
  });

  const service = app.service('v1/quotes');



  service.hooks({
    before: {
      find: [authenticate('jwt')],
    },
    after: {
      find: [],
    },
  });
};
export default quotes;
