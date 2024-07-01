import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";
import {CompanyShift} from "./company-shift";


// Note: created at and updated at automatically added to document
export interface ShiftPolicy extends Document {
  policyName: string;
  createdBy: User;
  companyId:Company;
  companyShiftId: CompanyShift,
  rotationFrequency : Number,
  rotationStartDay: String
}