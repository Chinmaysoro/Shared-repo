import Excel from 'exceljs';

const downloadCandidateBulkUpload = (app: any) => {
	app.get('/v1/download-sample-csv', async (req: any, res: any) => {
		try {
			const workbook = new Excel.Workbook();
			const worksheet = workbook.addWorksheet('sheet1');

			worksheet.columns = [
				{ header: 'Sl No' },
        { header: 'Employee Title(M)' },
        { header: 'Employee FirstName(M)' },
        { header: 'Employee MiddleName(O)' },
				{ header: 'Employee LastName(M)' },
        { header: 'Employee Email(O)' },
				{ header: 'Employee Contact No(M)' },
				{ header: 'Employee Department(M)' },
        { header: 'Employment Type(O)' },
				{ header: 'Company(M)' },
				{ header: 'Password(M)' },
				{ header: 'DOB(DD-MM-YYYY)(O)' },
        { header: 'Blood group(O)' },
        { header: 'Gender(M)' },
        { header: 'Marital status(M)' },
        { header: 'Nationality(M)' },
        { header: 'Religion(M)' },
        { header: 'Emergency contact no(O)' },
        { header: 'Alternative contact no(O)' },
        { header: 'Permanent address(M)' },
        { header: 'Present address(M)' },
        { header: 'Location(O)' },
        { header: 'Division(O)' },
        { header: 'Designation(M)' },
        { header: 'Grade(O)' },
        { header: 'Date of hire(O)' },
        { header: 'Employee Id(O)' },
        { header: 'Work email Id(O)' },
        { header: 'Bank name(O)' },
        { header: 'Branch(O)' },
        { header: 'IFSC code(O)' },
        { header: 'Account no(O)' },
        { header: 'PAN(O)' },
        { header: 'Aadhar no(O)' },
        { header: 'Voter ID(O)' },
        { header: 'UAN No(O)' },
        { header: 'CUG No(O)' },
        { header: 'Biometric id(O)' },
        { header: 'ESIC No(O)' },
        { header: 'Driving license(O)' },
      ];
			const defaultVal = [
				1,
        'Mr',
				'Malay',
        'Kumar',
				'Rath',
				'malay@gmail.com',
				'9090909090',
				'Technology',
        'confirmed',
				'Ab tech',
				'pass123',
				'2008-06-28',
        'B +ve',
        'Male',
        'single',
        'Indian',
        'Hindu',
        '8984999996',
        '8984999997',
        'SS vihar BBS',
        'SS vihar BBS Odisha',
        'Bhubaneswar',
        'Technology',
        'Developer',
        'A1',
        '2008-06-28',
        '1234',
        'ab@gmail.com',
        'SBI',
        'BBS',
        'SBIN22454',
        '789648677179671',
        'JWPPK434L',
        '78784545787485',
        'gbukfyb',
        '7981487662',
        '61877967',
        '7176',
        '861767687',
        '784DsgunT'
			];
			worksheet.addRow(defaultVal);
			const fileName = 'Bulk-User-Registration-Sample.csv';

			// res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

			workbook.csv.write(res).then(function () {
				res.end();
			});
		} catch (err) {
			/* eslint-disable no-console */
			console.log('OOOOOOO this is the error: ' + err);
		}
	});
};

export default downloadCandidateBulkUpload;
