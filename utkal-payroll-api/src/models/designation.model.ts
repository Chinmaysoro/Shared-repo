
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import { Designation } from '../interfaces/models/designation';

export default function (app: Application): Model<Designation> {
  const modelName = 'designation';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<Designation> = new mongooseClient.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
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
  return mongooseClient.model<Designation>(modelName, schema);
}