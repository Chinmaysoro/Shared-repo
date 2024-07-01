import { Document } from 'mongoose';
import {Company} from "./company";


/**
 * User object <Mongo Document>
 * @note created at and updated at automatically added to document
 */
export interface User extends Document {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	password: string;
	role: number;
  userUniqueId: string;
	username: string;
  empId: string;
  avatar: string;
	address: string;
	gender: string;
	doj: Date;
	about: string;
	passwordResetToken: string;
	passwordResetTokenExpiry: Date;
	status: string;
	deletedBy: User;
  companyId:Company;
	deleted: boolean;
	deletedAt: Date;
  manager: User;
  hr: User;
  approver: User;
  location: string;
  emergencyPhoneNum: string;
  relativeName: string;
  relation: string;
  annualSalary: string;
  pan: string;
  ifsc: string;
  accountNumber: string;
  beneficiaryName:string;
  PF: boolean;
  ESIC: boolean;
}
