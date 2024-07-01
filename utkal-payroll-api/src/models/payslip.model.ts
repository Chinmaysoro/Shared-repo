// payslip-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose,Schema } from 'mongoose';
import {Payslip} from "../interfaces/models/payslip";

export default function (app: Application): Model<any> {
  const modelName = 'payslip';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<Payslip> = new mongooseClient.Schema({
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'users',
    },
    userId: {
      type: ObjectId,
      index: true,
      ref: 'users',
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    document: {
      type: String
    },
    month: {
      type: String
    },
    year: {
      type: String
    },
    paybleDays: {
      type: Number
    },
    totalPaybleDays: {
      type: Number
    },
    arrearPaybleDays: {
      type: Number
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    isProcessed:{
      type: Boolean,
      default: false
    },
    salaryStatus:{
      type: String,
      enum: ['unprocessed','processing', 'processed', 'hold', 'released', 'published'],
      default: 'unprocessed'
    },
    paymentMethod:{
      type: String,
      enums: ['Cash', 'Cheque', 'UPI/Internet Banking']
    },
    monthlyPay:{
      type: Number
    },
    totalPayable:{
      type: Number
    },
    payComponents:{
      type: Array
    },
    payGroupId: {
      type: ObjectId,
      ref: 'payGroup',
    },
    payGroupName:{
      type: String
    },
    monthlyCTC:{
      type: Number
    },
    annualCTC:{
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
  return mongooseClient.model<Payslip>(modelName, schema);
}
