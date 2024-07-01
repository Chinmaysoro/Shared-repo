const resetPassword = (app) => {
	app.post('/v1/reset-password', async (req, res) => {
		const { password, confirmPassword, token } = req.body;

		if (!confirmPassword || !password || !token) {
			return res.status(400).send({ message: 'please provide password and confirmPassword' });
		}
		if (password !== confirmPassword) {
			return res.status(400).send({ message: 'Password and confirm password should be same' });
		}

		// const passwordRegex = /^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/;
		const userService = app.service('v1/users');

		const user = await userService
			._find({
				query: {
					passwordResetToken: token,
				},
				paginate: false,
			})
			.then((response) => (response && response[0] ? response[0] : null));
		if (user) {
			await userService.patch(user._id, {
				password,
				passwordResetToken: null,
				passwordResetTokenExpiry: null,
			});

			res.send({ message: 'Password updated successfully' });
		} else {
			return res.status(400).send({ message: 'you are not authorized to change password' });
		}
	});
};

export default resetPassword;
