// reimbursement-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { Reimbursement } from '../interfaces/models/reimbursement';

export default function (app: Application): Model<Reimbursement> {
  const modelName = 'reimbursement';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<Reimbursement> = new mongooseClient.Schema({
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'users',
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    document: {
      type: String
    },
    cause: {
      type: String
    },
    amount: {
      type: Number,
    },
    reimbursementType: {
      type: ObjectId,
      ref: 'reimbursementType',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
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
  return mongooseClient.model<Reimbursement>(modelName, schema);
}
