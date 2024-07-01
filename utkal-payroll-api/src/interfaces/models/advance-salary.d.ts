import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface AdvanceSalary extends Document {
  createdBy: User;
  amount: number;
  emi: number;
  reason: string;
  approvalStatus: string;
  companyId:Company;

}
