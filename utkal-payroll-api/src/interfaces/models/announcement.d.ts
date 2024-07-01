import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";

// Note: created at and updated at automatically added to document
export interface Announcement extends Document {
  createdBy: User;
  announcementDate: Date;
  companyId:Company;
  note: string;
}
