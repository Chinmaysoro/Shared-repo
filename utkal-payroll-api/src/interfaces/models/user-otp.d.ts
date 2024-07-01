import { User } from './users';

export interface UserOtp extends Document {
	code: string;
	userId: User;
}
