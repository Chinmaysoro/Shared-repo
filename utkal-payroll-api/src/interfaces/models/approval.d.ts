import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface Approval extends Document {
  userId: User;
  approverId: User;
  approveId: string;
  entityType: string;
  entityId: string;
  companyId:Company;
  approvalStatus: string;
}
