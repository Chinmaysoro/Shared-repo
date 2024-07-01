import { Hook, HookContext } from '@feathersjs/feathers';


const updateServiceWiseApproval =
  (): Hook =>
    async (context: HookContext): Promise<HookContext> => {
      const { app, data } = context;
      const approvalService = app.service('v1/approval');
      const approveData = await approvalService.find({query: {entityId : context.id}})
      if(context.path === 'v1/leave'&& context.method === 'patch' && data.approvalStatus){
        approvalService.patch(approveData.data[0]._id,{approvalStatus: data.approvalStatus})
      }
      if(context.path === 'v1/reimbursement'&& context.method === 'patch' && data.approvalStatus){
        approvalService.patch(approveData.data[0]._id,{approvalStatus: data.approvalStatus})
      }
      if(context.path === 'v1/resignation'&& context.method === 'patch' && data.approvalStatus){
        approvalService.patch(approveData.data[0]._id,{approvalStatus: data.approvalStatus})
      }
      if(context.path === 'v1/advance-salary'&& context.method === 'patch' && data.approvalStatus){
        approvalService.patch(approveData.data[0]._id,{approvalStatus: data.approvalStatus})
      }

      return context;
    };

export default updateServiceWiseApproval;
