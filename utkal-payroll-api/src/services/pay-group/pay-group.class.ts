import { Id, Params} from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

export class PayGroup extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async get(id: Id, params?: Params): Promise<Record<string,any>> {
    params = params || {};
    params.query = params.query || {};

    params.query.$populate = {
      path: 'components.component', // Adjust the path as per your data structure
      select: 'name type', // Include only the necessary fields
    };
    // console.log();
    return super.get(id, params)
  }

}
