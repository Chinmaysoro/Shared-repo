import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface Department extends Document {
  name: string;
  createdBy: User;
  updatedBy: User;
  deletedBy: User;
  deleted: boolean;
  companyId:Company;

  deletedAt: Date;
}
