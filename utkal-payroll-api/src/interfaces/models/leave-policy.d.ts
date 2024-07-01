import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";
import {LeaveType} from "./leave-type";

// Note: created at and updated at automatically added to document
export interface LeavePolicy extends Document {
  policyName: string;
  numberLeaveCredited: number;
  creditFrequency: number;
  maxLeaveCarryForward: number;
  leaveType: LeaveType;
  encashmentAllowed: boolean;
  roundOffLeave: boolean;
  enableLeaveReqFromDoj: boolean;
  elligibleDays: number;
  canLeaveOnWeekOff: boolean;
  canLeaveOnHoliday: boolean;
  documentProof: boolean;
  clubbing: boolean;
  leaveIsMoreThanDays: number;
  createdBy: User;
  note: string;
  companyId:Company;
}



// If Yes Leave is more than [number Field] Days
