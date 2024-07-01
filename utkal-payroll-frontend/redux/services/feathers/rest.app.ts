import {feathers, Service } from '@feathersjs/feathers';
import auth, { AuthenticationClient } from '@feathersjs/authentication-client';
import { CookieStorage } from 'cookie-storage';
import rest from '@feathersjs/rest-client';
import Axios from 'axios';
import services from './services.json';

export const authCookieName = 'candidatetkt';
export const cookieDomain = '.personifwy.com';

export const cookieStorage = new CookieStorage();

export const cookieStorageGetItem = (key: string): string | null => {
    try {
        return cookieStorage.getItem(key);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Cookie parse fail:', e);
        return null;
    }
};

const restClient = rest(process.env.baseURL);
// console.log(restClient);

const restApp = feathers();
restApp.configure(restClient.axios(Axios));

class MyAuthenticationClient extends AuthenticationClient {
    async setAccessToken(accessToken: string) {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.cookieStorage = cookieStorage;
        }
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        await cookieStorage.setItem(authCookieName, accessToken, {
            path: '/',
            domain: location.hostname !== 'localhost' ? cookieDomain : undefined,
            expires: oneYearFromNow,
            // secure: true,
            sameSite: 'Strict'
        });
    }
}

restApp.configure(
    auth({
        path: services.authentication,
        locationKey: '/',
        // cookie: process.env.NEXT_COOKIE_NAME,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment,
        // @ts-ignore,
        cookie: authCookieName,
        // storageKey: process.env.NEXT_COOKIE_NAME,
        storageKey: authCookieName,
        storage: cookieStorage,
        Authentication: MyAuthenticationClient
    })
);

export const AuthenticationService: Service<any> = restApp.service(services.authentication);
export const ForgotPasswordService: Service<any> = restApp.service(services.forgotPassword);
export const ResetPasswordService: Service<any> = restApp.service(services.resetPassword);
export const ChangePasswordService: Service<any> = restApp.service(services.changePassword);
export const UserService: Service<any> = restApp.service(services.users);

export const CompanyService: Service<any> = restApp.service(services.company);

export const DepartmentService: Service<any> = restApp.service(services.department);
export const DesignationService: Service<any> = restApp.service(services.designation);
export const CallHistoryService: Service<any> = restApp.service(services.callHistory);
export const AttendanceService: Service<any> = restApp.service(services.attendance);
export const AttendanceMusterService: Service<any> = restApp.service(services.attendanceMuster);
export const DownloadAttendanceService: Service<any> = restApp.service(services.downloadAttendance);
export const LeaveService: Service<any> = restApp.service(services.leave);
export const ReimbursementService: Service<any> = restApp.service(services.reimbursement);
export const ReimbursementTypeService: Service<any> = restApp.service(services.reimbursementType);
export const AdvanceSalaryService: Service<any> = restApp.service(services.advanceSalary);
export const SalaryComponentService: Service<any> = restApp.service(services.salaryComponent);
export const LeadsService: Service<any> = restApp.service(services.leads);
export const UploadService: Service<any> = restApp.service(services.uploadFile);
export const PayslipService: Service<any> = restApp.service(services.payslip);
export const ResignationTypeService: Service<any> = restApp.service(services.resignationType);
export const ResignationService: Service<any> = restApp.service(services.resignation);
export const PayGroupService: Service<any> = restApp.service(services.payGroup);
export const PayComponentsService: Service<any> = restApp.service(services.payComponents);
export const CompanyShiftsService: Service<any> = restApp.service(services.companyShifts);
export const HolidayListService: Service<any> = restApp.service(services.holidayList);
export const UserSalaryService: Service<any> = restApp.service(services.userSalary);
export const LeaveBalanceService: Service<any> = restApp.service(services.leaveBalance);
export const LeaveTypeService: Service<any> = restApp.service(services.leaveType);
export const AnnouncementService: Service<any> = restApp.service(services.announcement);
export const GradeService: Service<any> = restApp.service(services.grade);
export const CompanywiseDocumentService: Service<any> = restApp.service(services.companywiseDocument);
export const UserDocumentsService: Service<any> = restApp.service(services.userDocuments);
export const LeavePolicyService: Service<any> = restApp.service(services.leavePolicy);
export const ShiftPolicyService: Service<any> = restApp.service(services.shiftPolicy);
export const SalaryStatusService: Service<any> = restApp.service(services.salaryStatus);
export const SalaryReportService: Service<any> = restApp.service(services.salaryReport);
export const SalarySlipService: Service<any> = restApp.service(services.salarySlip);
export const UpdateWorkingDaysService: Service<any> = restApp.service(services.updateWorkingDays);
export const ShiftMusterService: Service<any> = restApp.service(services.shiftMuster);
// export const uploadFile = (file: File): Promise<any> => {
//   const formData = new FormData();
//   formData.append('uri[]', file);
//   return UploadService.create(formData);
// };

export default restApp;
