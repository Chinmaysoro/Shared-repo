// advance-salary-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose,Schema } from 'mongoose';
import { AdvanceSalary } from '../interfaces/models/advance-salary';


export default function (app: Application): Model<AdvanceSalary> {
  const modelName = 'advanceSalary';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<AdvanceSalary> = new mongooseClient.Schema({
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'users',
    },
    reason: {
      type: String
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    emi: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    deleted: {
      type: Boolean,
      default: false,
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
  return mongooseClient.model<AdvanceSalary>(modelName, schema);
}
