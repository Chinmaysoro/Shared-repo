import { Document } from 'mongoose';
import { User } from './users';

export interface Files extends Document {
	originalName: string;
	storage: string;
	link: string;
	size: number;
	createdBy: User;
}
