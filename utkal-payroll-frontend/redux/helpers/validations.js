import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(3, 'Username must be 3 characters at minimum'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be 6 characters at minimum')
});

export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be 6 characters at minimum').required('Password is required')
});
export const resetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required')
});
export const departmentSchema = Yup.object().shape({
    name: Yup.string().required('Please enter department name')
});
export const userDocumentSchema = Yup.object().shape({
    companywiseDocumentsId: Yup.string().required('Document type field is required')
    // file: Yup.string().required('Document file field is required')
});

export const leaveTypeSchema = Yup.object().shape({
    name: Yup.string().required('Please enter document type'),
    shortName: Yup.string().required('Please enter short name')
});
export const componentSchema = Yup.object().shape({
    name: Yup.string().required('Please enter component name'),
    type: Yup.string().required('Please select type of component'),
    natureOfPayment: Yup.string().required('Please select nature of payment')
});
export const payGroupComponentSchema = Yup.object().shape({
    salaryComponentId: Yup.string().required('Please select salary component'),
    payComponentsType: Yup.string().required('Please select type of component')
    // fixed_value: Yup.number().when('type', {
    //     is: 'Fixed',s
    //     then: Yup.number().required('Fixed Value is required')
    // }),
    // percentage_value: Yup.number().when('type', {
    //     is: 'Percentage',
    //     then: Yup.number().required('Percentage Value is required')
    // })
});
export const addPaygroupSchema = Yup.object().shape({
    name: Yup.string().required('Please enter pay-group name'),
    description: Yup.string().required('Please enter description')
});
export const reimbursementTypeSchema = Yup.object().shape({
    name: Yup.string().required('Please enter reimbursement type')
});
export const addReimbursementSchema = Yup.object().shape({
    reimbursementType: Yup.string().required('Please select reimbursement type'),
    amount: Yup.string().required('Please enter amount')
});
export const addResignationSchema = Yup.object().shape({
    resignationType: Yup.string().required('Please select resignation type'),
    resignDate: Yup.string().required('Please select resign date'),
    lastWorkingDate: Yup.string().required('Please select last working date')
});
export const advanceSalarySchema = Yup.object().shape({
    amount: Yup.string().required('Please enter amount'),
    emi: Yup.string().required('Please enter emi')
});
export const experienceSchema = Yup.object().shape({
    startDate: Yup.date().max(Yup.ref('endDate'), 'Start Date must be before End Date'),
    endDate: Yup.date().min(Yup.ref('startDate'), 'End Date must be after Start Date')
});

export const designationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter designation name')
});
export const gradeSchema = Yup.object().shape({
    name: Yup.string().required('Please enter grade name')
});
export const announcementSchema = Yup.object().shape({
    note: Yup.string().required('Announcement note is required'),
    announcementDate: Yup.date().required('Announcement date is required').nullable()
});
export const holidaySchema = Yup.object().shape({
    note: Yup.string().required('Please enter occasion'),
    attendanceDate: Yup.string().required('Occasion date required')
});
export const companySchema = Yup.object().shape({
    name: Yup.string().required('Please enter company name'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    website: Yup.string().required('Please enter website address'),
    phone: Yup.string().required('Please enter phone number')
});
export const employeeSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter first name'),
    lastName: Yup.string().required('Please enter last name'),
    phone: Yup.string().required('Please enter phone number'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be 6 characters at minimum'),
    cnfpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match'),
    userUniqueId: Yup.string().required('Please enter emp id')
});

export const addCompanyAdminSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter first name'),
    lastName: Yup.string().required('Please enter last name'),
    phone: Yup.string().required('Please enter phone number'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be 6 characters at minimum'),
    cnfpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match')
});

export const UpdateLeadsSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter first name'),
    lastName: Yup.string().required('Please enter last name'),
    phone: Yup.string().required('Please enter phone number'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    companyName: Yup.string().required('Please enter company name')
});

export const employeeLeaveSchema = Yup.object().shape({
    startDate: Yup.string().required('Start date required'),
    endDate: Yup.string().required('End date required')
});

export const updateAttendanceSchema = Yup.object().shape({
    attendanceDate: Yup.string().required('Please select date'),
    startTime: Yup.string().required('Start time required'),
    endTime: Yup.string().required('End time required'),
    attendanceStatus: Yup.string().required('Please select attendance status')
});

export const employeeUpdateSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter first name'),
    lastName: Yup.string().required('Please enter last name'),
    phone: Yup.string().required('Please enter phone number'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    userUniqueId: Yup.string().required('Please enter emp id')
});
export const personalProfileSchema = Yup.object().shape({
    abbreviation: Yup.string()
        // .matches(/^[A-Za-z]+$/, 'First name cannot contain numbers')
        .required('Abbreviation is required'),
    nationality: Yup.string()
        // .matches(/^[A-Za-z]+$/, 'First name cannot contain numbers')
        .required('Nationality is required'),
    religion: Yup.string()
        // .matches(/^[A-Za-z]+$/, 'First name cannot contain numbers')
        .required('Religion is required'),
    // bloodGroup:Yup.string()
    // // .matches(/^[A-Za-z]+$/, 'First name cannot contain numbers')
    // .required('Blood group is required'),
    firstName: Yup.string()
        // .matches(/^[A-Za-z]+$/, 'First name cannot contain numbers')
        .required('First name is required'),
    lastName: Yup.string()
        // .matches(/^[A-Za-z]+$/, 'Last name cannot contain numbers')
        .required('Last name is required'),
    gender: Yup.string().required('Please select a gender'),
    permanentAddress: Yup.string().required('Permanent address is required'),
    // address: Yup.string().required('Present address is required'),
    maritalStatus: Yup.string().required('Marital status is required'),
    // email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{1,10}$/, 'Phone number must be a maximum of 10 digits and contain only numbers')
        .required('Phone number is required')
        .min(10, 'Phone no must be 10 digit')
        .max(10, '')
    // emergencyPhoneNum: Yup.string()
    //     .matches(/^[0-9]{1,10}$/, 'Emergency number must be a maximum of 10 digits and contain only numbers')
    //     .required('Emergency number is required')
    //     .min(10, 'Emergency no must be 10 digit')
    //     .max(10, ''),
    // dob: Yup.date().required('Date of birth is required').nullable().max(new Date(), 'Date of birth cannot be a future date')
});
export const proffessionalProfileSchema = Yup.object({
    designationId: Yup.string().required('Designation is required'),
    departmentId: Yup.string().required('Department is required')
    // doj: Yup.string().required('Date of hire is required'),
    // employmentStatus: Yup.string().required('Please select employment type'),
    // workMail: Yup.string().email('Invalid email address').required('Work email is required')
});

export const companyShiftSchema = Yup.object({
    name: Yup.string().required('Shift name is required'),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
    breakStartTime: Yup.string().required('Break start time is required'),
    breakEndTime: Yup.string().required('Break end time is required'),
    minimumHalfDayHR: Yup.string().required('Minimum half day hour is required'),
    minimumFullDayHR: Yup.string().required('Minimum full day hour is required')
});
export const financialProfileSchema = Yup.object({
    bankName: Yup.string().required('Bank name is required'),
    ifsc: Yup.string().required('IFSC code is required'),
    accountNumber: Yup.string().required('Bank account number is required')
});
export const documentSchema = Yup.object({
    aadhar: Yup.string().required('Aadhar number is required'),
    pan: Yup.string().required('PAN number is required')
});

export const credentialSchema = Yup.object({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});
export const employeeFilterSchema = Yup.object().shape({
    phoneNumber: Yup.string().min(10, 'Phone number should be 10 digit').max(10, 'Phone number should be 10 digit')
});

export const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Password is required').min(6, 'Password must be 6 characters at minimum'),
    newPassword: Yup.string().required('Password is required').min(6, 'New password must be 6 characters at minimum'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Password must match')
});

export const companyAttendanceSchema = Yup.object().shape({
    name: Yup.string().required('Please enter company name'),
    dayStart: Yup.string().required('Start time required'),
    dayEnd: Yup.string().required('End time required'),
    fullDay: Yup.string().required('Please enter number of hours')
});

export const uploadPayslipSchema = Yup.object().shape({
    yearname: Yup.string().required('Please select year'),
    monthname: Yup.string().required('Please select month')
});

export const userSalarySchema = Yup.object().shape({
    // payGroupId: Yup.string().required('Please select paygroup'),
    annualCTC: Yup.string().required('Please enter annual CTC')
});

export const leaveBalanceSchema = Yup.object().shape({
    payGroupId: Yup.string().required('Please select paygroup'),
    leaveType: Yup.string().required('Please select leave type'),
    balance: Yup.string().required('Please enter balance')
});

export const leavePolicySchema = Yup.object().shape({
    policyName: Yup.string().required('Please enter policy name')
});
export const leavePolicyDetailSchema = Yup.object().shape({
    policyLeaveType: Yup.string().required('Please select leave policy type'),
    numberLeaveCredited: Yup.string().required('Please enter no. of leave to credit'),
    creditFrequency: Yup.string().required('Please select credit frequency'),
    maxLeaveCarryForward: Yup.string().required('Please enter max leave carry forward'),
    leave_type: Yup.string().required('Please select leave type'),
    encashmentAllowed: Yup.string().required('Please select encashment'),
    roundOffLeave: Yup.string().required('Please select round off leave'),
    enableLeaveReqFromDoj: Yup.string().required('Please select enable leave request'),
    canLeaveOnWeekOff: Yup.string().required('Please select can leave on week-off'),
    canLeaveOnHoliday: Yup.string().required('Please select can leave on holiday'),
    documentProof: Yup.string().required('Please select document proof'),
    clubbing: Yup.string().required('Please select clubing')
});
export const ShiftPolicyDetailSchema = Yup.object().shape({
    companyShiftId: Yup.string().required('Please select company shift'),
    rotationFrequency: Yup.string().required('Please enter rotaion frequency'),
    rotationStartDay: Yup.string().required('Please enter rotation start date')
});
export const addShiftRotationPolicies = Yup.object().shape({
    policyName: Yup.string().required('Please enter policy name'),
    rotationStartDay: Yup.string().required('Please select rotation shift'),
    rotationFrequency: Yup.string().required('Please enter rotation frequency')
});
export const documentTypeSchema = Yup.object().shape({
    name: Yup.string().required('Please enter document name'),
});
