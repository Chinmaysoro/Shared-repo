// leads-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'leads';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    firstName: {
      type: String,
      index: true,
      required: [true, 'First Name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      index: true,
      required: [true, 'Last Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
      required: [true, 'phone number is required!'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      required: [true, 'email is required'],
    },
    companyName: {
      type: String
    },
    noOfEmployee: {
      type: Number
    },
    location: {
      type: String
    },
    status: {
      type: String,
      enum: [
        'active',
        'converted'
      ],
      default: 'active',
    },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
