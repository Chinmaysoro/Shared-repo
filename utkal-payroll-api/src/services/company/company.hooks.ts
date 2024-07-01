import * as authentication from '@feathersjs/authentication';
import handleSoftDelete from "../../hooks/handleSoftDelete";
import setCreatedBy from "../../hooks/setCreatedBy";
import uniqueCheck from '../../hooks/uniqueCheck';
import getAllChildCompany from "./hooks/getAllChildCompany";
import createCompany from "./hooks/createCompany";

// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [handleSoftDelete('deleted', true),getAllChildCompany()],
    get: [handleSoftDelete('deleted', true)],
    create: [setCreatedBy(),createCompany(),	uniqueCheck('v1/company', 'Company already exists', 'name'),],
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
