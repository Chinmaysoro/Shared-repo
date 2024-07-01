// app-version-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import {AppVersion} from "../interfaces/models/app-version";

export default function (app: Application): Model<AppVersion> {
  const modelName = 'appVersion';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const schema: Schema<AppVersion> = new mongooseClient.Schema({
    latestVersion: {
      type: String,
      required: true,
    },
    isUnderMaintenance: {
      type: Boolean,
    },
  }, {
    timestamps: true
  });


  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<AppVersion>(modelName, schema);
}
