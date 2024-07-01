// user-otp-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import {UserOtp} from "../interfaces/models/user-otp";

export default function (app: Application): Model<UserOtp> {
  const modelName = 'userOtp';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema: Schema<UserOtp> = new mongooseClient.Schema({
    code: {
      type: String,
      required: true,
      expires: '10m',
    },
    userId: {
      type: ObjectId,
      index: true,
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
  return mongooseClient.model<UserOtp>(modelName, schema);
}
