// user-documents-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import { UserDocuments } from '../interfaces/models/user-documents';

export default function (app: Application): Model<any> {
  const modelName = 'userDocuments';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<UserDocuments> = new mongooseClient.Schema({
    file: {
      type: String
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    companywiseDocumentsId: {
      type: ObjectId,
      ref: 'companywiseDocuments',
      index: true,
    },
    title:{
      type: String
    },
    userId: {
      type: ObjectId,
      ref: 'users',
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
  return mongooseClient.model<UserDocuments>(modelName, schema);
}
