// users-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { User } from '../interfaces/models/users';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function (app: Application): Model<User> {
  const modelName = 'users';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { ObjectId } = Schema.Types;
  const schema: Schema<User> = new mongooseClient.Schema(
    {
      abbreviation: {
        type: String,
      },
      firstName: {
        type: String,
        index: true,
        required: [true, 'First Name is required'],
        trim: true,
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        index: true,
        required: [true, 'Last Name is required'],
        trim: true,
      },
      phone: {
        type: String
      },
      email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true,
        index: true
      },
      password: {
        type: String,
        trim: true,
        required: [true, 'password is required'],
        minlength: 8,
      },
      role: {
        type: Number,
        enum: [65535, 32767, 5,1],
        index: true,
      },
      payGroupId: {
        type: ObjectId,
        ref: 'payGroup',
      },
      companyShiftId: {
        type: ObjectId,
        ref: 'companyShift',
      },
      username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true,
        index: true
      },
      empId: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
        index: true,
        required: [true, 'empId is required'],
      },
      companyId: {
        type: ObjectId,
        ref: 'company',
        index: true,
      },
      departmentId: {
        type: ObjectId,
        ref: 'department',
      },
      gradeId: {
        type: ObjectId,
        ref: 'grade',
      },
      designationId: {
        type: ObjectId,
        ref: 'designation',
      },
      avatar: {
        type: String,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
      },
      employmentStatus: {
        type: String,
        enum: ['confirmed','contract','probation'],
      },
      doj: {
        type: Date,
      },
      about: {
        type: String,
      },
      permanentAddress: {
        type: String,
      },
      address: {
        type: String,
      },
      userUniqueId: {
        type: String,
      },
      passwordResetToken: {
        type: String,
        index: true,
      },
      passwordResetTokenExpiry: {
        type: Date,
      },
      status: {
        type: String,
        enum: [
          'active',
          'disabled'
        ],
        default: 'active',
      },
      hr: {
        type: ObjectId,
        ref: 'users',
      },
      approver: {
        type: String,
        enum: [
          'manager',
          'hr'
        ],
        default: 'hr',
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
      manager: {
        type: ObjectId,
        ref: 'users',
      },
      location: {
        type: String,
      },
      division: {
        type: String,
      },
      emergencyPhoneNum: {
        type: String,
      },
      alternativePhoneNum: {
        type: String,
      },
      relativeName: {
        type: String,
      },
      relation: {
        type: String,
      },
      annualSalary: {
        type: String,
      },
      pan: {
        type: String,
      },
      panFile: {
        type: String,
      },
      uan: {
        type: String,
      },
      esicNo: {
        type: String,
      },
      aadhar: {
        type: String,
      },
      aadharFile: {
        type: String,
      },
      voter: {
        type: String,
      },
      voterFile: {
        type: String,
      },
      drivingLicence: {
        type: String,
      },
      drivingLicenceFile: {
        type: String,
      },
      dob: {
        type: Date,
      },
      bloodGroup: {
        type: String,
      },
      maritalStatus: {
        type: String,
      },
      workMail: {
        type: String,
      },
      cugNo: {
        type: String,
      },
      biometricId: {
        type: String,
      },
      bankName: {
        type: String,
      },
      branch: {
        type: String,
      },
      ifsc: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      beneficiaryName: {
        type: String,
      },
      PF: {
        type: Boolean,
        default: false,
      },
      ESIC: {
        type: Boolean,
        default: false,
      },
      religion: {
        type: String,
      },
      nationality: {
        type: String,
      },
      pastExperience: [{
        orgName: {
          type: String,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        designation: {
          type: String,
        },
        annualCTC: {
          type: String,
        },
      }],
      familyDetails: [{
        name: {
          type: String,
        },
        relation: {
          type: String,
        },
        dob: {
          type: Date,
        },
        age: {
          type: Number,
        },
        bloodGroup: {
          type: String,
        },
      }],
      educationalDetails: [{
        degree: {
          type: String,
        },
        university: {
          type: String,
        },
        board: {
          type: String,
        },
        yearOfPassing: {
          type: String,
        },
        percentage: {
          type: String,
        },
        grade: {
          type: String,
        }
      }]
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

  const Model = mongooseClient.model<User>(modelName, schema);
  return Model;
}
