// announcement-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import {Announcement} from "../interfaces/models/announcement";

export default function (app: Application): Model<any> {
  const modelName = 'announcement';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<Announcement> = new mongooseClient.Schema({
    announcementDate: {
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
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<Announcement>(modelName, schema);
}
