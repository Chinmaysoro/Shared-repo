import cron from 'node-cron';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const setAttendance = async (app: any) => {
	await cron.schedule('30 18 * * *', async () => {
		const attendanceService = app.service('v1/attendance');
		const DAY_MS =24 * 60 * 60 * 1000;
		const attendanceData = await attendanceService._find({
			query: {
				createdAt: {
					$gt: new Date().getTime() - DAY_MS,
				},
        endTime: { $exists: false }
			},
		});
		const promises = attendanceData.data.map((each) => {
			// eslint-disable-next-line
      return new Promise(async function(resolve, reject) {
        await attendanceService.patch(each._id,{
          endTime: new Date(each.startTime).setHours(new Date(each.startTime).getHours() + 8),
          checkOutBy: 'system',
          attendanceStatus: 'unapproved'
        })
				resolve(each);
			});
		});

		await Promise.all(promises);
		return;
	});
};

export default setAttendance;
