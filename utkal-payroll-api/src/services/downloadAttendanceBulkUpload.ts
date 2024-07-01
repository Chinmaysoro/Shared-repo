import Excel from 'exceljs';

const downloadAttendanceBulkUpload = (app: any) => {
  app.get('/v1/download-attendance-csv', async (req: any, res: any) => {
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('sheet1');

      worksheet.columns = [
        { header: 'Sl No' },
        { header: 'Employee ID' },
        { header: 'Employee AttendanceDate' },
        { header: 'Clock-In Time' },
        { header: 'Clock-Out Time' }
      ];
      const defaultVal = [
        1,
        'emp123',
        '15-06-2024',
        '9:00 AM',
        '6:00 PM'
      ];
      worksheet.addRow(defaultVal);
      const fileName = 'Bulk-Attendance-Sample.csv';

      // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

      workbook.csv.write(res).then(function () {
        res.end();
      });
    } catch (err) {
      /* eslint-disable no-console */
      console.log('Bulk Upload throw the error: ' + err);
    }
  });
};

export default downloadAttendanceBulkUpload;
