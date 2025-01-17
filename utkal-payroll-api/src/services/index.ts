import { Application } from '../declarations';
import users from './users/users.service';
import company from './company/company.service';
import forgotPassword from './forgot-password';
import resetPassword from './reset-password';
import files from './files/files.service';
import userOtp from './user-otp/user-otp.service';
import department from './department/department.service';
import designation from './designation/designation.service';
import attendance from './attendance/attendance.service';
import salaryStatus from './salary-status/salary-status.service';
import leave from './leave/leave.service';
import reimbursement from './reimbursement/reimbursement.service';
import loan from './loan/loan.service';
import downloadCandidateBulkUpload from './downloadUserBulkUpload';
import callDetails from './call-details/call-details.service';
import bulkRegistration from "./bulkRegistration";
import AppVersion from './app-version/app-version.service';
import changePassword from './change-password';
import quotes from './quotes';
import advanceSalary from './advance-salary/advance-salary.service';
import reimbursementType from './reimbursement-type/reimbursement-type.service';
import resignation from './resignation/resignation.service';
import resignationType from './resignation-type/resignation-type.service';
import payslip from './payslip/payslip.service';
import fileUpload from './file-upload/file-upload.service';
import downloadAttendance from "./downloadAttendance";

import salaryComponent from './salary-component/salary-component.service';
import payGroup from './pay-group/pay-group.service';
import leads from './leads/leads.service';
import payComponents from './pay-components/pay-components.service';
import userSalary from './user-salary/user-salary.service';
import holidayList from './holiday-list/holiday-list.service';
import approval from './approval/approval.service';
import dashboardFilter from './dashboard-filter/dashboard-filter.service';
import leaveBalance from './leave-balance/leave-balance.service';
import companyShift from './company-shift/company-shift.service';
import announcement from './announcement/announcement.service';
import downloadAttendanceBulkUpload from "./downloadAttendanceBulkUpload";
import bulkUploadAttendance from "./bulkUploadAttendance";
import leaveType from './leave-type/leave-type.service';
import grade from './grade/grade.service';
import userDocuments from './user-documents/user-documents.service';
import companywiseDocuments from './companywise-documents/companywise-documents.service';
import attendanceMuster from './attendance-muster'
import shiftMuster from './shift-muster'

import firebaseNotification from './firebase-notification/firebase-notification.service';
import leavePolicy from './leave-policy/leave-policy.service';
import shiftPolicy from './shift-policy/shift-policy.service';
import updateWorkingDays from './updateWorkingDays';
import downloadSalaryReport from './downloadSalaryStatus';
import downloadpayslip from './downloadPayslip';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(company);
  app.configure(forgotPassword);
  app.configure(resetPassword);
  app.configure(files);
  app.configure(userOtp);
  app.configure(department);
  app.configure(designation);
  app.configure(attendance);
  app.configure(salaryStatus);
  app.configure(leave);
  app.configure(reimbursement);
  app.configure(loan);
  app.configure(callDetails);
  app.configure(downloadCandidateBulkUpload);
  app.configure(bulkRegistration);
  app.configure(AppVersion);
  app.configure(changePassword);
  app.configure(advanceSalary);
  app.configure(reimbursementType);
  app.configure(resignation);
  app.configure(resignationType);
  app.configure(payslip);
  app.configure(fileUpload);
  app.configure(downloadAttendance);
  app.configure(salaryComponent);
  app.configure(payGroup);
  app.configure(leads);
  app.configure(payComponents);
  app.configure(userSalary);
  app.configure(holidayList);
  app.configure(approval);
  app.configure(quotes);
  app.configure(dashboardFilter);
  app.configure(leaveBalance);
  app.configure(companyShift);
  app.configure(announcement);
  app.configure(downloadAttendanceBulkUpload);
  app.configure(bulkUploadAttendance);
  app.configure(leaveType);
  app.configure(grade);
  app.configure(userDocuments);
  app.configure(companywiseDocuments);
  app.configure(attendanceMuster);
  app.configure(updateWorkingDays);
  app.configure(firebaseNotification);
  app.configure(leavePolicy);
  app.configure(shiftPolicy);
  app.configure(downloadSalaryReport);
  app.configure(downloadpayslip);
  app.configure(shiftMuster);
}
