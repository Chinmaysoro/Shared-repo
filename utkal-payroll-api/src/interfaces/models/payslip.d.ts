import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface Payslip extends Document {
  createdBy: User;
  userId: User;
  document: string;
  month: string;
  year: string;
  companyId:Company;

}
