// leave-policy-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose,Schema  } from 'mongoose';
import { LeavePolicy } from "../interfaces/models/leave-policy";

export default function (app: Application): Model<LeavePolicy> {
  const modelName = 'leavePolicy';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema: Schema<LeavePolicy> = new mongooseClient.Schema({
    policyName: {
      type: String,
      trim: true,
      required: true
    },
    leaveDetails: [
      {
        policyLeaveType: {
          type: ObjectId,
          ref: 'leaveType',
        },
        numberLeaveCredited: {
          type: Number,
        },
        creditFrequency: {
          type: Number,
        },
        maxLeaveCarryForward: {
          type: Number,
        },
        leave_type:{
          type: String,
        },
        leaveType: {
          type: ObjectId,
          ref: 'leaveType',
        },
        encashmentAllowed: {
          type: Boolean,
          default: false,
        },
        roundOffLeave: {
          type: Boolean,
          default: false,
        },
        enableLeaveReqFromDoj: {
          type: Boolean,
          default: false,
        },
        elligibleDays: {
          type: Number,
        },
        canLeaveOnWeekOff: {
          type: Boolean,
          default: false,
        },
        canLeaveOnHoliday: {
          type: Boolean,
          default: false,
        },
        documentProof: {
          type: Boolean,
          default: false,
        },
        clubbing: {
          type: Boolean,
          default: false,
        },
        note: {
          type: String
        },
        leaveIsMoreThanDays: {
          type: Number
        },
      }
    ],
    createdBy: {
      type: ObjectId,
      ref: 'users',
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    }, 
    entityId: [{
      type: ObjectId,
      refPath: 'entityType',
    }],
    entityType: {
      type: String,
      enum: ['company', 'department', 'designation', 'grade'],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
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
  return mongooseClient.model<LeavePolicy>(modelName, schema);
}
