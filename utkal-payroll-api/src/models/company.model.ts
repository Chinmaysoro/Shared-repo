// company-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { Company } from '../interfaces/models/company';

export default function (app: Application): Model<Company> {
  const modelName = 'company';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { ObjectId } = Schema.Types;
  const schema: Schema<Company> = new mongooseClient.Schema(
    {
      name: {
        type: String,
        trim: true,
        required: true,
        index: true,
      },
      email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        index: true,
      },
      parentId: {
        type: ObjectId,
        ref: 'company',
        default: null,
      },
      hasChild: {
        type: Boolean,
        default: false,
      },
      website: {
        type: String,
        trim: true,
      },
      location: [String],
      division: [String],
      phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        required: true,
      },
      logo: {
        type: String,
      },
      createdBy: {
        type: ObjectId,
        ref: 'users',
      },
      companyUniqueId: {
        type: String,
        trim: true,
      },
      about: {
        type: String,
        trim: true,
      },
      colorCode: {
        type: String,
      },
      pan: {
        type: String,
      },
      address: {
        type: String,
      },
      gstNo: {
        type: String,
      },
      file: {
        type: String,
      },
      businessNature: {
        type: String,
      },
      industry: {
        type: String,
      },
      companySize: {
        type: Number
      },
      dayStart: {
        type: Date,
      },
      dayEnd: {
        type: Date,
      },
      fullDay: {
        type: Number
      },
      deleted: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    },
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  const Model = mongooseClient.model<Company>(modelName, schema);
  return Model;
}
