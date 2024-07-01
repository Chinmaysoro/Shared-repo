import { BadRequest } from '@feathersjs/errors';
import randomstring from 'randomstring';
import { sendMail } from '../hooks/sendmail';
import ForgotPassword from '../template/forgotPassword';

const forgotPassword = (app) => {
	app.use('/v1/forgot-password', {
		async create(data) {
			const { email, source } = data;
			const userService = app.service('v1/users');

			const userData = await userService
				._find({
					query: { email: email },
					paginate: false,
				})
				.then((response: any[]) => (response && response[0] ? response[0] : null));
			if (userData === null) {
				throw new BadRequest('Email has not registered');
			} else {
				const today = new Date();
				today.setHours(today.getHours() + 1);
				const passwordResetTokenExpiry = new Date(today);

				const passwordResetToken = randomstring.generate({
					length: 32,
					charset: 'alphanumeric',
				});
				const passwordReset = {
					passwordResetToken: passwordResetToken,
					passwordResetTokenExpiry: passwordResetTokenExpiry,
				};

				await userService._patch(userData._id, passwordReset);
				let url;
				if (source === 'app') {
					url = `${app.get('candidateUrl')}/forgot-password/reset/${passwordResetToken}`;
				} else {
					url = `${app.get('baseurl')}/forgot-password/reset/${passwordResetToken}`;
				}

				const options = {
					to: data.email,
					subject: 'Reset password link',
					text: ForgotPassword.render({
						firstName: data.firstName,
						link: url,
					}),
				};
				await sendMail(app, options);

				return {
					url: url,
					message: 'Mail sent successfully',
				};
			}
		},
	});

	const service = app.service('v1/forgot-password');

	service.hooks({
		before: {
			create: [],
		},
		after: {
			create: [],
		},
	});
};
export default forgotPassword;
