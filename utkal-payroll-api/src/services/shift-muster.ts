import { BadRequest } from '@feathersjs/errors';
import * as authentication from '@feathersjs/authentication';
const { authenticate } = authentication.hooks;
import moment from 'moment'; // You may need a date library
import generateShiftReport from '../hooks/generateShiftReport';
// Separate function to generate attendance report for a user


const shiftMuster = (app) => {
  app.use('/v1/shift-muster', {
    async find(params) {
      const { month, year, companyId, userId } = params.query;

      // Get the first day of the specified month
      const startDate = moment(`${year}-${month}-${1}`).startOf('month');
      
      // Get the last day of the specified month
      const endDate = moment(startDate).endOf('month');

      const userService = app.service('v1/users');
      const userData = await userService._find({
        query: { companyId: companyId, role: 1, $populate: ['departmentId'], ...(userId ? { _id: userId } : {}) },
        paginate: false,
      });

      const result = await generateShiftReport(app, companyId, startDate, endDate, userData);
      return result;
    }
  });

  const service = app.service('v1/shift-muster');

  service.hooks({
    before: {
      find: [authenticate('jwt')],
    },
    after: {
      find: [],
    },
  });
};

export default shiftMuster;
