// grade-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose,Schema } from 'mongoose';
import {Grade} from "../interfaces/models/grade";

export default function (app: Application): Model<Grade> {
  const modelName = 'grade';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<Grade> = new mongooseClient.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    createdBy: {
      type: ObjectId,
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
  return mongooseClient.model<Grade>(modelName, schema);
}
