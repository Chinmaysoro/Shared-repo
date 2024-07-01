// pay-components-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose,Schema } from 'mongoose';
import { PayComponents } from "../interfaces/models/pay-components";

export default function (app: Application): Model<PayComponents> {
  const modelName = 'payComponents';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema: Schema<PayComponents> = new mongooseClient.Schema({
    payGroupId: {
      type: ObjectId,
      ref: 'payGroup',
    },
    salaryComponentId: {
      type: ObjectId,
      ref: 'salaryComponent',
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    fixedAmount: {
      type: String
    },
    percentage: {
      type: String
    },
    taxExempt: {
      type: Boolean,
      default: false,
    },
    payComponentsType: {
      type: String,
      enum: ['fixAmount', 'percentage', 'other'],
      default: 'percentage'
    },
    createdBy: {
      type: ObjectId,
      ref: 'users',
    },
    updatedBy: {
      type: ObjectId,
      ref: 'users',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: ObjectId,
      ref: 'users',
    },
    deletedAt: {
      type: Date,
    },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<PayComponents>(modelName, schema);
}
