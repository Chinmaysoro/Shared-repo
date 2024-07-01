// call-details-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import {Model, Mongoose, Schema} from 'mongoose';
import { CallDetails } from '../interfaces/models/call-details';


export default function (app: Application): Model<any> {
  const modelName = 'callDetails';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { ObjectId } = Schema.Types;
  const schema: Schema<CallDetails> = new mongooseClient.Schema({
      name: {
        type: String,
      },
      duration: {
        type: String,
      },
      userPhoneNumber: {
        type: String,
      },
      createdBy: {
        type: ObjectId,
        ref: 'users',
      },
      phoneNumber: {
        type: String,
      },
      type: {
        type: String,
      },
      rawType: {
        type: String,
      },
      timestamp: {
        type: String,
      },
      dateTime: {
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
  return mongooseClient.model<CallDetails>(modelName, schema);
}
