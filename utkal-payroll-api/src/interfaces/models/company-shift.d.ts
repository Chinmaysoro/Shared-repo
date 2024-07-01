import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface CompanyShift extends Document {
  name: String;
  createdBy: User;
  startTime: Date;
  endTime: Date;
  breakStartTime: Date;
  breakEndTime: Date;
  minimumHalfDayHR: Number;
  minimumFullDayHR: Number;
  companyId:Company;
  updatedBy: User;
  deletedBy: User;
  deleted: boolean;
  deletedAt: Date;
}
