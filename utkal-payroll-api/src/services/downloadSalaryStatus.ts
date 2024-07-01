import Excel from 'exceljs';

const downloadSalaryReport = (app: any) => {
  app.get('/v1/salary-report', async (req: any, res: any) => {
    try {
      const { companyId, month, year, type = 1 } = req.query;
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('sheet1');

      const columns: any = [
        { header: 'Employee Code' },
        { header: 'Employee Name' },
        { header: 'Mobile Number' },
        // { header: 'Department' },
        { header: 'Payroll Group' },
        { header: 'Monthly CTC'}
      ];

      const query: any = {
        companyId,
        month,
        year,
        salaryStatus: { $in: type == 1 ? ['processed'] :  ['released', 'hold']},
        $populate:{
          path:'userId',
          select: 'firstName middleName lastName empId designationId phone'
        }
      }
 
      const payslips = await app.service('v1/payslip')._find({
        query,
        paginate: false,
      });

      // console.log(payslips);
      const newColumns = new Set();

      payslips.forEach(element => {

        let componentMapper = {};

        element.payComponents.forEach(element1 => {
          newColumns.add(element1.name);
          componentMapper[element1.name] = element1.actualValue;
        });
        element.componentMapper = componentMapper;
        // console.log(element);
      });

      // console.log([...newColumns]);

      newColumns.forEach((element: any) => {
        columns.push({header: element})
      });
      columns.push({header: 'Net TakeHome'});

      if(type == 2 ){
        columns.push({header: 'Payment Method'},{header: 'Payment Status'});
      }
      // console.log(columns);


      worksheet.columns = columns;
      payslips.forEach(payslip => {
        // Dynamically generate rows based on extracted keys
        const rowData = [...newColumns].map((key:any) => payslip.componentMapper[key] || 0);

        rowData.push(payslip.totalPayable);

        if(type == 2){
          rowData.push(payslip.paymentMethod || '' , payslip.salaryStatus);
        }

        // console.log([ payslip.userId.empId, `${payslip.userId.firstName} ${payslip.userId.middleName} ${payslip.userId.lastName}`, payslip.userId.phone, payslip.payGroupName, payslip.monthlyCTC, ...rowData]);

        
        worksheet.addRow([ payslip.userId.empId, `${payslip.userId.firstName} ${payslip.userId.middleName} ${payslip.userId.lastName}`, payslip.userId.phone, payslip.payGroupName, payslip.monthlyCTC, ...rowData]);
      });
      // const defaultVal = [
      //   1,
      //   'emp123',
      //   '28-06-2023',
      //   '9:30 AM',
      //   '6:30 PM'
      // ];
      // worksheet.addRow(defaultVal);
      const fileName = `process-salary-${month}-${year}.xlsx`;
      // res.send({});

      // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

      workbook.xlsx.write(res).then(function () {
        res.end();
      });
    } catch (err) {
      /* eslint-disable no-console */
      console.log('err during download salary report: ' + err);
    }
  });
};

export default downloadSalaryReport;
