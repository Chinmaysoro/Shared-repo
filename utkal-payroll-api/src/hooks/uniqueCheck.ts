import { Hook, HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import mongoose from 'mongoose';
const uniqueCheck =
	(service: string, message: string, key: string): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { app, data } = context;
		const queryData = {};
		if (key === 'name') queryData[key] = data[key];
		else if (key === 'title') queryData[key] = data[key];
		else if (key === 'question') queryData[key] = data[key];
		else queryData[key] = mongoose.Types.ObjectId(data[key]);
		const serviceData = await app
			.service(service)
			._find({
				query: queryData,
				paginate: false,
			})
			.then((response: any[]) => (response && response[0] ? response[0] : null));
		if (serviceData?.deleted) {
			const updatedData = await app.service(service)._patch(serviceData?._id, {
				deleted: false,
				createdAt: new Date(),
			});
			context.result = updatedData;
		} else if (serviceData != null) {
			throw new BadRequest(message);
		}
		return context;
	};

export default uniqueCheck;
