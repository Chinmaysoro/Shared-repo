import moment from 'moment'; // You may need a date library

function generateReportForUser(each, attendanceData, holidayData, leaveData, weeklyOffDays,startDate,endDate ) {
    const report = [];
    let currentDate = moment(startDate);
  
    while (currentDate <= endDate) {
      const date = currentDate.toDate();
      const isHoliday = holidayData.some((holiday) => moment(holiday.attendanceDate).isSame(date, 'day'));
      const isLeave = leaveData.some((leave) => {
        const startDate = moment(leave.startDate);
        const endDate = moment(leave.endDate);      
        // Adjust startDate to the start of the day and endDate to the end of the day
        startDate.startOf('day');
        endDate.endOf('day');
        // Ensure date is included in the range [startDate, endDate]
        const isBetween = moment(date).isBetween(startDate, endDate, null, '[]');      
        return isBetween;
      });
      
      const isPresentFd = attendanceData.some((attendance) => moment(attendance.attendanceDate).isSame(date, 'day') && attendance.attendanceStatus === 'fullDay');
      const isPresentHd = attendanceData.some((attendance) => moment(attendance.attendanceDate).isSame(date, 'day') && attendance.attendanceStatus === 'halfDay');
  
      let status = 'A'// Default to present
      if (date > new Date()) {
        status = 'NA'; // Date is greater than current date
      } else if (isLeave) {
        status = 'L'; // Leave
      } else if (isPresentFd) {
        status = 'P'; // Present
      } else if (isPresentHd) {
        status = 'HD'; // Present HD
      }
      if (weeklyOffDays.length && weeklyOffDays.includes(currentDate.format('dddd'))) {
        status = 'WO'; // Weekly Off
      }
      if (isHoliday) {
        status = 'PH'; // Holiday
      }
      // @ts-ignore
      report.push({ date, status });

      currentDate = currentDate.add(1, 'day');
    }
    return report;
  }
  export default generateReportForUser