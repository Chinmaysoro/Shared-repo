import { Document } from 'mongoose';
import { User } from './users';
import {SalaryComponent} from "./salaryComponent";
import { PayGroup } from "./payGroup";
import {Company} from "./company";


// Note: created at and updated at automatically added to document
export interface PayComponents extends Document {
  payGroupId: PayGroup;
  salaryComponentId: SalaryComponent;
  companyId:Company;
  payComponentsType: string;
  fixedAmount: string;
  percentage: string;
  createdBy: User;
  updatedBy: User;
  deletedBy: User;
  deleted: boolean;
  deletedAt: Date;
  taxExempt: boolean;
}
