import { User } from './users';
import {PayGroup} from "./pay-group";
import {Company} from "./company";

export interface LeaveBalance extends Document {
  payGroupId: PayGroup;
  leaveType: String;
  companyId:Company;
  balance: Number;
  createdBy: User;
  updatedBy: User;
  deletedBy: User;
  deleted: boolean;
  deletedAt: Date;
}
