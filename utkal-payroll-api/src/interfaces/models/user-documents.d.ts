import { Document } from 'mongoose';
import { User } from './users';
import {Company} from "./company";
import { CompanywiseDocuments } from './companywise-documents';

// Note: created at and updated at automatically added to document
export interface UserDocuments extends Document {
  file: string;
  companywiseDocumentsId: CompanywiseDocuments;
  companyId:Company;
  userId: User;
  createdBy: User;
  updatedBy: User;
  deletedBy: User;
  deleted: boolean;
  deletedAt: Date;
}
