import { BadRequest } from '@feathersjs/errors';
import moment from 'moment'; // You may need a date library
import generateAttendanceReport from './generateAttendanceReport';

// Need to recheck if valid cade or not.


const fetchWorkingDaysByUser = async (app: any, userList: any, month: any, year: any) => {
	
  // Get the first day of the specified month
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  // console.log(`current month ${currentMonth} current year ${currentYear}`);
  
  // Get the last day of the specified month
  const startDate = moment(`${year}-${month}-01`).startOf('month');
  const endDate = moment(startDate).endOf('month');
  const totalDaysInMonth = startDate.daysInMonth();

  const currentDate = moment();
  const isCurrentDateInRangeOrFuture = currentDate.isSameOrAfter(startDate, 'day') && currentDate.isSameOrBefore(endDate, 'day') || year > currentYear || (year === currentYear && month > currentMonth)
  function calculateDays(startDate, endDate) {
    return moment(endDate).diff(moment(startDate), 'days') + 1;
  }
  let resultData = []
  if(isCurrentDateInRangeOrFuture){
    throw new BadRequest('Can not calculate for Future Date or rurrning month');
  }else {
    await Promise.all(userList.map(async (each) => {
        try {
          // Find leave data for the current user

        const userService = app.service('v1/users');
        const userData = await userService.get(each);

        const result = await generateAttendanceReport(app, userData.companyId, startDate, endDate, [userData]);

        const statusAObjects = result[0].report.filter(item => item.status === 'A');

        const statusHD = result[0].report.filter(item => item.status === 'HD');


        // Count the number of occurrences
        const numberOfStatusAbsent = statusAObjects.length;
        const numberOfHD = statusHD.length/2;


          const leaveData = await app.service('v1/leave').find({
            query: {
              startDate: {
                $gte: startDate.toDate(),
              },
              endDate: {
                $lte: endDate.toDate(),
              },
              createdBy: each,
              approvalStatus: { $in: ['pending', 'rejected'] }, // Filter for 'pending' or 'rejected'
            },
            paginate: false,
          });
          let leaveCount = 0
          // Calculate the number of days for each leave record with 'pending' or 'rejected' status
          await leaveData.forEach(leave => {
            const days = calculateDays(leave.startDate, leave.endDate);
            leaveCount = leaveCount + days
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
            resultData.push({user: userData,totalPayableDaysInMonth:totalDaysInMonth,totalUnapprovedLeave: leaveCount,totalAbsent: numberOfStatusAbsent, totalPaidDays: totalDaysInMonth - (leaveCount+numberOfStatusAbsent+numberOfHD)})
      
        } catch (error) {
          console.error(`Error processing user ${each}:`, error);
        }
      }));
  }
	return resultData
};

export default fetchWorkingDaysByUser;
