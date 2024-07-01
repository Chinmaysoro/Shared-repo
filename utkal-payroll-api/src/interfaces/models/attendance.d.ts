import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface Attendance extends Document {
  createdBy: User;
  attendanceDate: Date;
  startTime: Date;
  endTime: Date;
  companyId:Company;
  note: string;
  checkOutBy: string;
  attendanceStatus: string;
  checkinStatus: string;
}
