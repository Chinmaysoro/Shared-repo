import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface ReimbursementType extends Document {
  name: string;
  createdBy: User;
  updatedBy: User;
  deletedBy: User;
  deleted: boolean;
  deletedAt: Date;
  companyId:Company;

}
