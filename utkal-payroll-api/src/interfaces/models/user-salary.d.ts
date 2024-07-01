import { User } from './users';
import {PayGroup} from "./pay-group";

export interface IUserSalary extends Document {
	annualCTC: number;
  monthlyCTC: string;
  annualSalaryBreakDown: object;
  monthlySalaryBreakDown: object;
  payGroupId: PayGroup;
  userId: User;
}
