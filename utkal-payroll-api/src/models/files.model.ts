// files-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose ,Schema } from 'mongoose';
import {Files} from '../interfaces/models/files';

export default function (app: Application): Model<Files> {
  const modelName = 'files';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema: Schema<Files> = new mongooseClient.Schema(
    {
      originalName: {
        type: String,
      },
      storage: {
        type: String,
        enum: ['S3'],
        default: 'S3',
      },
      link: {
        type: String,
      },
      size: {
        type: Number,
      },
      createdBy: {
        type: ObjectId,
        ref: 'users',
      },
    }, {
      timestamps: true
    });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<Files>(modelName, schema);
}
