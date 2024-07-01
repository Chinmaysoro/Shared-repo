import * as authentication from '@feathersjs/authentication';
import handleSoftDelete from "../../hooks/handleSoftDelete";
import setCreatedBy from "../../hooks/setCreatedBy";
import setCompany from "../../hooks/setCompany";
import createApproval from "../approval/hooks/createApproval";
import updateServiceWiseApproval from "../approval/hooks/updateServiceWiseApproval";
import checkPayslipStatus from '../../hooks/checkPayslipStatus';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [handleSoftDelete('deleted', true)],
    get: [handleSoftDelete('deleted', true)],
    create: [setCreatedBy(),setCompany()],
    update: [],
    patch: [setCreatedBy('updatedBy'),handleSoftDelete('deleted', true), checkPayslipStatus()],
    remove: [handleSoftDelete('deleted', true)]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createApproval()],
    update: [],
    patch: [updateServiceWiseApproval()],
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
