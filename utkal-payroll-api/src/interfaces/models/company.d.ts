import { Document } from 'mongoose';
import { User } from './users';

// Note: created at and updated at automatically added to document
export interface Company extends Document {
	name: string;
	email: string;
	website: string;
  parentId: string | null;
  hasChild: boolean;
	phone: string;
	logo: string;
	createdBy: User;
	companyUniqueId: string;
	about: string;
	colorCode: string;
	deletedAt: Date;
	deleted: boolean;
  dayStart: Date;
  dayEnd: Date;
  fullDay: number;
  pan: string;
  address: string;
  gstNo: string;
  file: string;
  businessNature: string;
  industry: string;
  companySize: number;
}
