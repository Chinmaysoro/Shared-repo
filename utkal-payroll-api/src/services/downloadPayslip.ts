import Payslip from '../template/payslip';
import { launch } from 'puppeteer';
import moment from 'moment';
import { ToWords } from 'to-words';

const monthMapper = {
    1: 'JANUARY',
    2: 'FEBRUARY',
    3: 'MARCH',
    4: 'APRIL',
    5: 'MAY',
    6: 'JUNE',
    7: 'JULY',
    8: 'AUGUST',
    9: 'SEPTEMBER',
    10: 'OCTOBER',
    11: 'NOVEMBER',
    12: 'DECEMBER'
}

const downloadpayslip = (app: any) => {
  app.get('/v1/download-payslip', async (req: any, res: any) => {
    try {
      const { companyId, month, year, userId } = req.query;
      

      const query: any = {
        companyId,
        month,
        year,
        salaryStatus: 'published',
        deleted: { $ne: true},
        userId,
        $populate:[
            {
                path:'userId',
                model: 'users',
                populate:[
                    {
                        path: 'departmentId',
                        model: 'department'
                    },
                    {
                        path: 'designationId',
                        model: 'designation'
                    }
                ]
            },
            {
                path:'companyId',
                model: 'company'
            }
        ]
      }

 
      const payslips = await app.service('v1/payslip')._find({
        query,
        paginate: false,
      });

      if(!payslips.length){
        res.send({message: 'Payslip not found'});
      }

      const payComponents = payslips[0].payComponents.map((comp: any)=>{
        return {
          ...comp,
          actualValue: comp.actualValue.toFixed(2)
        }
      });

    //   console.log(payslips[0].payComponents);
      const html = Payslip.render({
        companyName: payslips[0].companyId.name,
        address: payslips[0].companyId.address,
        month : monthMapper[month],
        year,
        name:  payslips[0].userId.firstName + ' ' +  payslips[0].userId.middleName+ ' '+ payslips[0].userId.lastName,
        pan:  payslips[0].userId.pan,
        empId:  payslips[0].userId.empId,
        gender:  payslips[0].userId.gender,
        designation:payslips[0].userId.designationId.name,
        acnt:  payslips[0].userId.accountNumber,
        location:  payslips[0].userId.location,
        pfAcnt:  payslips[0].userId.uan,
        joinDate:  moment(payslips[0].userId.doj).format('DD-MM-YYYY'),
        uan:  payslips[0].userId.uan,
        department:  payslips[0].userId.departmentId.name,
        esic:  payslips[0].userId.esicNo,
        paybleDays:  payslips[0].paybleDays,
        totalPay:  payslips[0].totalPayable.toFixed(2),
        totalPayWord: new ToWords().convert(payslips[0].totalPayable.toFixed(2)),
        additionComp : payComponents.filter(cmp => cmp.type === 'addition'),
        deductionComp: payComponents.filter(cmp => cmp.type === 'deduction')
      });

      const pdfBuffer = await convertHtmlToPdf(html);

        // Set response headers for PDF download
        const fileName = `${payslips[0].userId.firstName}-${month}-${year}-payslip.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Send PDF as response
        res.send(pdfBuffer);
    

    //   res.send({});
      
    } catch (err) {
      /* eslint-disable no-console */
      console.log('err during download pay slip: ' + err);
    }
  });
};

// Function to convert HTML to PDF using Puppeteer
async function convertHtmlToPdf(html: string): Promise<Buffer> {
    const browser = await launch({ timeout: 60000, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({printBackground: true});
    await browser.close();
    return pdfBuffer;
}


export default downloadpayslip;
