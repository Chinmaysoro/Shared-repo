import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface HolidayList extends Document {
  holidayDate: Date;
  note: string;
  companyId:Company;
  createdBy: User;
}
