import { Document } from 'mongoose';
/**
 * User object <Mongo Document>
 * @note created at and updated at automatically added to document
 */
export interface User extends Document {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	company : string;
	status: string;
  noOfEmployee: Number;
  location: string;
	deletedBy: User;
	deleted: boolean;
	deletedAt: Date;
}
