
import { Hook, HookContext } from '@feathersjs/feathers';

const checkOutValidations = (): Hook => async (context: HookContext): Promise<HookContext> => {
  const {user} = context.params;
  const {data, app, id} = context;
  const attendanceService = app.service('v1/attendance');

  if (data.endTime) {
    const attendanceData = await attendanceService.get(id);
    const startDate = new Date(attendanceData.startTime);
    const endDate   = new Date(data.endTime);

    const userService = app.service("v1/users");

    const userData = await userService.get(attendanceData.createdBy);

    let companyShiftQuery = { companyId: userData.companyId}
    if(userData.companyShiftId){
      companyShiftQuery['_id'] = userData.companyShiftId
    }

    const companyShiftData = await app.service('v1/company-shift')._find({
      query: companyShiftQuery,
      paginate: false,
    });

    if(companyShiftData.minimumHalfDayHR && companyShiftData.minimumFullDayHR){
      const minutes = (endDate.getTime() - startDate.getTime()) / 60000;
      if(minutes < 10 ){
        data.attendanceStatus = 'absent'
      }else if(minutes > (companyShiftData.minimumHalfDayHR * 60) && minutes < (companyShiftData.minimumFullDayHR * 60)){
        data.attendanceStatus = 'halfDay'
      }else {
        data.attendanceStatus = 'fullDay'
      }
    }else{
      const minutes = (endDate.getTime() - startDate.getTime()) / 60000;
      if(minutes < 240 ){
        data.attendanceStatus = 'absent'
      }else if(minutes > 240 && minutes < 480){
        data.attendanceStatus = 'halfDay'
      }else {
        data.attendanceStatus = 'fullDay'
      }
    }

  }
  return context;
};

export default checkOutValidations;
