// company-shift-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { CompanyShift } from '../interfaces/models/company-shift';

export default function (app: Application): Model<CompanyShift> {
  const modelName = 'companyShift';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema: Schema<CompanyShift> = new mongooseClient.Schema({
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    name: {
      type: String
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    minimumHalfDayHR: {
      type: Number,
    },
    minimumFullDayHR: {
      type: Number,
    },
    breakStartTime: {
      type: Date,
    },
    checkInAllowanceTime: {
      type: Number,
    },
    graceTime: {
      type: Number,
    },
    breakEndTime: {
      type: Date,
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
    default: {
      type: Boolean,
      default: false,
    },
    weeklyOff: [{
      weeklyOffDay:{
        type: String
      },
      dayType: {
        type: String,
        enum: ['halfDay','fullDay'],
        default: 'fullDay'
      }
    }],
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
  return mongooseClient.model<CompanyShift>(modelName, schema);
}
