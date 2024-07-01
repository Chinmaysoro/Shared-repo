// shift-policy-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose,Schema  } from 'mongoose';
import { ShiftPolicy } from "../interfaces/models/shift-policy";

export default function (app: Application): Model<ShiftPolicy> {
  const modelName = 'shiftPolicy';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema: Schema<ShiftPolicy> = new mongooseClient.Schema({
    policyName: {
      type: String,
      trim: true,
      required: true
    },
    entityId: [{
      type: ObjectId,
      refPath: 'entityType',
    }],
    entityType: {
      type: String,
      enum: ['company', 'department', 'designation', 'grade'],
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
    companyShiftId: [{
      type: ObjectId,
      ref: 'companyShift',
      index: true,
    }],
    rotationFrequency: {
      type: Number
    },
    rotationStartDay: {
      type: String
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
  return mongooseClient.model<ShiftPolicy>(modelName, schema);
}
