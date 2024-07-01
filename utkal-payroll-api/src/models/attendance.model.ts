// Attendance-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import { Attendance } from '../interfaces/models/attendance';

export default function (app: Application): Model<any> {
  const modelName = 'attendance';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<Attendance> = new mongooseClient.Schema({
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    attendanceDate: {
      type: Date,
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'users',
    },
    note: {
      type: String
    },
    checkOutBy: {
      type: String,
      enum: ['employee', 'admin', 'system'],
      default: 'employee'
    },
    attendanceStatus: {
      type: String,
      enum: ['halfDay', 'fullDay', 'absent', 'active', 'unapproved'],
      default: 'active'
    },
    checkinStatus: {
      type: String,
      enum: ['lateEntry', 'onTime'],
      default: 'onTime'
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
  return mongooseClient.model<any>(modelName, schema);
}
