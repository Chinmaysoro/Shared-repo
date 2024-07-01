// approval-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import { Approval } from '../interfaces/models/approval';

export default function (app: Application): Model<Approval> {
  const modelName = 'approval';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<Approval> = new mongooseClient.Schema({
    companyId: {
      type: ObjectId,
      ref: 'company'
    },
    userId: {
      type: ObjectId,
      ref: 'users'
    },
    approverId: {
      type: ObjectId,
      ref: 'users'
    },
    entityId: {
      type: ObjectId,
      refPath: 'entityType',
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['leave', 'reimbursement', 'advanceSalary', 'resignation'],
      required: true,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
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
