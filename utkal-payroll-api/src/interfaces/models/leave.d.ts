import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";
import {LeaveType} from "./leave-type";

// Note: created at and updated at automatically added to document
export interface Leave extends Document {
  createdBy: User;
  startDate: Date;
  endDate: Date;
  reason: string;
  type: string;
  leaveType: LeaveType;
  leaveDay: string;
  approvalStatus: string;
  companyId:Company;

}
