// salary-component-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { SalaryComponent } from '../interfaces/models/salaryComponent';


export default function (app: Application): Model<SalaryComponent> {
  const modelName = 'salaryComponent';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;
  const schema: Schema<SalaryComponent> = new mongooseClient.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    payGroupId: {
      type: ObjectId,
      ref: 'payGroup',
    },
    type: {
      type: String,
      enum: ['addition', 'deduction', 'variable', 'others'],
    },
    natureOfPayment:{
      type: String,
      enum: [ 'fixed', 'variable']
    },
    taxExempt: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['enabled', 'disabled'],
    },
    createdBy: {
      type: ObjectId,
      ref: 'users',
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
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
    partOfGross:{
      type: Boolean,
      default: true
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<SalaryComponent>(modelName, schema);
}
