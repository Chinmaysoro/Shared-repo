import { Role } from '../types/roles';
import { HookContext, Params } from '@feathersjs/feathers';
import { Forbidden, NotAuthenticated } from '@feathersjs/errors';
import { HookFunction } from '../types/HookContext';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import roleNames from './../../config/roleNames.json';

export class Permission {
	SUPER_ADMIN = [roleNames['SUPER_ADMIN'], roleNames['ADMIN']];
	constructor() {
		this.SUPER_ADMIN;
	}
	should =
		(...roles: [Role]) =>
		(context: HookContext): HookContext => {
			const params: Params = context.params;

			const user = params.user;

			if (!user) throw new NotAuthenticated();
			if (roles.indexOf(user.role.toString()) > -1) return context;

			throw new Forbidden('you are not authorized to do this action');
		};

	get isAdmin(): HookFunction {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore this.SUPER_ADMIN
		return this.should(...this.SUPER_ADMIN);
	}

	get isUser(): HookFunction {
		return this.should(1);
	}

	is(...roles: [Role]): boolean {
		try {
			this.should(...roles);
		} catch (e) {
			return false;
		}
		return true;
	}
}

export const Permit = new Permission();
