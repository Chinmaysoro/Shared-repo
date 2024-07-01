import { Document } from 'mongoose';
import { User } from './users';
import {ResignationType} from "./resignation-type";
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface Resignation extends Document {
  createdBy: User;
  resignationType: ResignationType;
  remark: string;
  approvalStatus: string;
  resignDate: date;
  lastWorkingDate: date;
  companyId:Company;

}
