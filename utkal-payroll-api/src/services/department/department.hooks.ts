import * as authentication from '@feathersjs/authentication';
import handleSoftDelete from "../../hooks/handleSoftDelete";
import setCreatedBy from "../../hooks/setCreatedBy";
import createDepartment from "./hooks/createDepartment";
import getAllChildDepartment from "./hooks/getAllChildDepartment";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [handleSoftDelete('deleted', true),getAllChildDepartment()],
    get: [handleSoftDelete('deleted', true)],
    create: [setCreatedBy(),createDepartment()],
    update: [],
    patch: [setCreatedBy('updatedBy'),handleSoftDelete('deleted', true)],
    remove: [handleSoftDelete('deleted', true)]
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
