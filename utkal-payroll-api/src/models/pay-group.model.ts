// pay-group-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema  } from 'mongoose';
import { PayGroup } from '../interfaces/models/pay-group';


export default function (app: Application): Model<PayGroup> {
  const modelName = 'payGroup';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const componentSchema = new Schema({
    component: { type: ObjectId, ref: 'salaryComponent' },
    type: { type: String, enum: ['formula', 'fixed'] },
    formula: { type: String }, // For formula type components
    value: { type: Number },  // For fixed type components
  }, {
    _id: false, // This will prevent Mongoose from automatically creating _id for subdocuments
  });

  const schema: Schema<PayGroup> = new mongooseClient.Schema({
    name: {
      type: String,
      index: true,
    },
    description: {
      type: String,
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
    components: [componentSchema]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<PayGroup>(modelName, schema);
}
