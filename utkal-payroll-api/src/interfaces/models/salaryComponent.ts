import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface SalaryComponent extends Document {
  createdBy: User;
  name: string;
  type: string;
  taxExempt: Boolean,
  status: string;
  companyId: Company;
  leaveDay: string;
  approvalStatus: string;
}
