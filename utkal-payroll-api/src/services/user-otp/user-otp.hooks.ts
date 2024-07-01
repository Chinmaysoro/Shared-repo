import { HooksObject } from '@feathersjs/feathers';
import {genarateCode} from "./hooks/genarateCode";
const { discard } = require('feathers-hooks-common')
// Don't remove this comment. It's needed to format import lines nicely.


export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [genarateCode()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [discard('code')],
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
