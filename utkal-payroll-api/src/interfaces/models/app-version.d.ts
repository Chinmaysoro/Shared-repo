import { User } from './users';

export interface AppVersion extends Document {
  latestVersion: string;
  isUnderMaintenance: boolean;
}
