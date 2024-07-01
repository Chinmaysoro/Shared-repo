import { Hook, HookContext } from '@feathersjs/feathers';
import randomstring from 'randomstring';
import { BadRequest } from '@feathersjs/errors';

const createUsername =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { data, app } = context;
		const userService = app.service('v1/users');

		if (data.phone) {
			const userDataPhone = await userService
				._find({
					query: {
						phone: data.phone,
					},
					paginate: false,
				})
				.then((response: any[]) => (response && response[0] ? response[0] : null));
			if (userDataPhone) throw new BadRequest(`${data.phone} phone already exist.`);
		}

		if (data.email) {
			const userDataEmail = await userService
				._find({
					query: {
						email: data.email,
					},
					paginate: false,
				})
				.then((response: any[]) => (response && response[0] ? response[0] : null));
			if (userDataEmail) throw new BadRequest(`${data.email} email already exist.`);
		}
		// To be edited...
    if(!data.empId){
			const allUsers = await userService
				._find()
				// .then((response: any[]) => (response && response[0] ? response[0] : null));
				// console.log("All Users:-", allUsers);
				// console.log("All Users total:-", allUsers.total);
				// console.log("All Users array length:-", allUsers.data.length);
				let userIdTemp = allUsers.data.length+1;
				// const expL = new Date().getFullYear().toLocaleString().slice(3);
				// console.log("expL:-", expL);
				userIdTemp<10?data.empId = 'EMP' + '-' + 0 + userIdTemp:data.empId = 'EMP' + '-' + userIdTemp;
				// data.empId = 'EMP' + '-' + Math.floor(10000 + Math.random() * 90000);

    }
		if (!data.username) {
			let domyUsername:string="";
			if (data.email) {
				domyUsername = data.email.split('@')[0];
				if (domyUsername.length < 10) {
					domyUsername = domyUsername + '_' + Math.floor(1000 + Math.random() * 9000);
				}
			}else if (data.phone) {
        domyUsername = data.phone;
        if (domyUsername.length < 5) {
          domyUsername = domyUsername + '_' + Math.floor(1000 + Math.random() * 9000);
        }
      }
			if (!data.password) {
				const pswd = randomstring.generate({
					length: 8,
					charset: 'alphabetic',
				});
				data.password = pswd;
				data.pswd = data.password;
			}
			data.username = domyUsername;
		}

		return context;
	};

export default createUsername;
