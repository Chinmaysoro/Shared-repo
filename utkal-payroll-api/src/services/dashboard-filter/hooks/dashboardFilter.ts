import { Hook, HookContext } from "@feathersjs/feathers";

// @ts-ignore
const dashboardFilter = (): Hook => async (context: HookContext): Promise<HookContext> => {
  const {params, app} = context;
  let {
    startDate, // time frame of the users
    endDate, // time frame of the users
    companyId
  } = params?.query || {};

  const userService = app.service("v1/users");
  const companyService = app.service("v1/company");
  const leaveService = app.service("v1/leave");
  const resinationService = app.service("v1/resignation");
  const advSalaryService = app.service("v1/advance-salary");
  const attendanceService = app.service("v1/attendance");
  const reimbursementService = app.service('v1/reimbursement');




  let query = {}
  if(companyId){
    query['companyId'] = companyId;
  }


  const userDataCount = await userService._find({ query:query });
  const companyCount = await companyService._find({});
  const leaveDataCount = await leaveService._find({ query:query });
  const resignDataCount = await resinationService._find({ query:query });
  const advSalaryCount = await advSalaryService._find({ query:query });
  const attendanceCount = await attendanceService._find({ query:query });
  const reimbursementCount = await reimbursementService._find({ query:query });


  let obj = {
    userDataCount: userDataCount.total,
    companyCount: companyCount.total,
    leaveDataCount: leaveDataCount.total,
    resignDataCount: resignDataCount.total,
    advSalaryCount: advSalaryCount.total,
    attendanceCount: attendanceCount.total,
    reimbursementCount: reimbursementCount.total
  }

  context.result = obj;
    return context;

}
export default dashboardFilter;
