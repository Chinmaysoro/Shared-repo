// leave-balance-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { LeaveBalance } from '../interfaces/models/leave-balance';

export default function (app: Application): Model<LeaveBalance> {
  const modelName = 'leaveBalance';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<LeaveBalance> = new mongooseClient.Schema({
    leaveBalence: [
     {
      balance: {
        type: Number,
      },
      leaveType: {
        type: ObjectId,
        ref: 'leaveType',
        index: true,
      }
     }
    ],
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    payGroupId: {
      type: ObjectId,
      index: true,
      ref: 'payGroup',
    },
    userId: {
      type: ObjectId,
      index: true,
      ref: 'users',
    },
    createdBy: {
      type: ObjectId,
      index: true,
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
  return mongooseClient.model<LeaveBalance>(modelName, schema);
}
