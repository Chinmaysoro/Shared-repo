// leave-type-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import {LeaveType} from "../interfaces/models/leave-type";

export default function (app: Application): Model<any> {
  const modelName = 'leaveType';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<LeaveType> = new mongooseClient.Schema({
    name: {
      type: String,
      trim: true,
      required: true
    },
    shortName: {
      type: String
    },
    isEncashmentAllowed: {
      type: Boolean,
      default: false,
    },
    isHalfDayAllowed: {
      type: Boolean,
      default: false,
    },
    maxCarryForward: {
      type: Number,
    },
    noOfLeavesCredited: {
      type: Number,
    },
    createdBy: {
      type: ObjectId,
      ref: 'users',
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    designationId: {
      type: ObjectId,
      ref: 'designation'
    },
    departmentId: {
      type: ObjectId,
      ref: 'department'
    },
    payGroupId: {
      type: ObjectId,
      ref: 'payGroup'
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
  return mongooseClient.model<LeaveType>(modelName, schema);
}
