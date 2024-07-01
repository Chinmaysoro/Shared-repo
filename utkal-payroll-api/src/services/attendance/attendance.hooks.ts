import * as authentication from '@feathersjs/authentication';
import handleSoftDelete from "../../hooks/handleSoftDelete";
import setCreatedBy from "../../hooks/setCreatedBy";
import checkOutValidations from "./hooks/checkOutValidations";
import setCompany from "../../hooks/setCompany";
import attendanceValidation from "./hooks/attendanceValidation";
import checkPayslipStatus from '../../hooks/checkPayslipStatus';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [handleSoftDelete('deleted', true)],
    get: [handleSoftDelete('deleted', true)],
    create: [setCreatedBy(),setCompany(),attendanceValidation(),checkOutValidations()],
    update: [],
    patch: [setCreatedBy('updatedBy'),handleSoftDelete('deleted', true),checkOutValidations(), checkPayslipStatus()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
