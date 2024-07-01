import { Document } from 'mongoose';
import { User } from './users';
import {ReimbursementType} from "./reimbursement-type";
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface Reimbursement extends Document {
  createdBy: User;
  document: string;
  amount: number;
  cause: string;
  type: string;
  approvalStatus: string;
  reimbursementType: ReimbursementType
  companyId:Company;
}
