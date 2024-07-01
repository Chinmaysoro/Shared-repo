import { Document } from 'mongoose';
import { User } from './users';

export interface CallDetails extends Document {
  name: string;
  duration: string;
  phoneNumber: string;
  userPhoneNumber: string;
  type: string;
  createdBy: User;
  rawType: string;
  timestamp: string;
  dateTime: Date;
}
