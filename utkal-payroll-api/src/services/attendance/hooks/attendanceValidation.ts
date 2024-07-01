
import { Hook, HookContext } from '@feathersjs/feathers';
import {BadRequest} from "@feathersjs/errors";

const attendanceValidation = (): Hook => async (context: HookContext): Promise<HookContext> => {
  const {data, app, params} = context;
  const attendanceService = app.service('v1/attendance');
  const targetDate = new Date(data.attendanceDate)
  const query = {
    createdBy: params?.user?._id,
    attendanceDate: {
      $gte:  new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).valueOf(), // Start of the day
      $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1).valueOf(), // End of the day
    },
  };
  if (data.startTime) {
    const  attendanceData = await attendanceService.find({query: query})
    if(attendanceData.data.length > 0){
      throw new BadRequest("Attendance already exist for Today");
    }
  }
  return context;
};

export default attendanceValidation;
