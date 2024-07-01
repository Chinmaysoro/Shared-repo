import nodemailer from 'nodemailer';

export const sendMail = async (app: any, options: any) => {
	const { to, subject, text } = options;
	const transport = nodemailer.createTransport({
		host: 'email-smtp.ap-south-1.amazonaws.com',
		port: '587',
		secure: false,
		name: '',
		auth: {
			user: '',
			pass: '',
		},
	});
	const from = '';

	const mail = {
		from: from,
		to: to,
		subject: subject,
		html: text,
	};

	await transport.sendMail(mail, function (error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + mail.to);
		}

		transport.close();
	});
};

export default sendMail;
