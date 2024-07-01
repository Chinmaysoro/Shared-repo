import { Document } from 'mongoose';
import { User } from './users';

// Note: created at and updated at automatically added to document
export interface Designation extends Document {
  name: string;
  createdBy: User;
  updatedBy: User;
  deletedBy: User;
  deleted: boolean;
  deletedAt: Date;
}
