// leave-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { Leave } from '../interfaces/models/leave';


export default function (app: Application): Model<Leave> {
  const modelName = 'leave';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema: Schema<Leave> = new mongooseClient.Schema({
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
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
    leaveType: {
      type: ObjectId,
      ref: 'leaveType',
    },
    reason: {
      type: String
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    leaveDay: {
      type: String,
      enum: ['halfDay', 'fullDay'],
    },
    type: {
      type: String,
      enum: ['sickLeave', 'causalLeave', 'plannedLeave', 'others'],
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
  return mongooseClient.model<Leave>(modelName, schema);
}
