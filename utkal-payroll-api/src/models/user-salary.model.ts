// user-salary-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import {IUserSalary} from "../interfaces/models/user-salary";

export default function (app: Application): Model<any> {
  const modelName = 'userSalary';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<IUserSalary> = new mongooseClient.Schema({
    userId: {
      type: ObjectId,
      index: true,
      ref: 'users',
    },
    annualCTC: {
      type: Number
    },
    monthlyCTC: {
      type: String
    },
    annualSalaryBreakDown: {
      type: Object
    },
    monthlySalaryBreakDown: {
      type: Object
    },
    payGroupId: {
      type: ObjectId,
      index: true,
      ref: 'payGroup',
    },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
