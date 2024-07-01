// salarySlip-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'salaryStatus';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema = new Schema({
    // text: { type: String, required: true },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    month: {
      type: String
    },
    year: {
      type: String
    },
    salaryStatus:{
      type: String,
      enum: ['processing', 'processed', 'released', 'published'],
      default: 'processing'
    },
    totalProcessPayout:{
      type: Number,
      default: 0
    },
    totalReleasePayout:{
      type: Number,
      default: 0
    },
    noOfReleasedEmployee:{
      type: Number
    },
    noOfHoldEmployee:{
      type: Number
    }
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
