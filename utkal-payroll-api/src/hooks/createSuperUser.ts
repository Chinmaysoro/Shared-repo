// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createSuperUser = async (app: any) => {
	const userService = app.service('v1/users');

	const userData = app.get('superUser');

	const user = await userService._find({
		query: {
			email: userData.email,
		},
	});
	if (user.data.length === 0) {
		await userService.create(userData);
		return;
	}

	return;
};

export default createSuperUser;
