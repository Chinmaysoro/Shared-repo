import { Hook, HookContext } from '@feathersjs/feathers';


const updateApproval =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { app, data, id } = context;
    const approvalService = app.service('v1/approval');
    const approveData = await approvalService.get(id)
    if(approveData.entityType === 'leave'&& context.method === 'patch' && data.approvalStatus){
      await app.service('v1/leave')._patch(approveData.entityId,{approvalStatus: data.approvalStatus})
    }
    if(approveData.entityType === 'reimbursement'&& context.method === 'patch' && data.approvalStatus){
      await app.service('v1/reimbursement')._patch(approveData.entityId,{approvalStatus: data.approvalStatus})
    }
    if(approveData.entityType === 'resignation'&& context.method === 'patch' && data.approvalStatus){
      await app.service('v1/resignation')._patch(approveData.entityId,{approvalStatus: data.approvalStatus})
    }
    if(approveData.entityType ===  'advanceSalary'&& context.method === 'patch' && data.approvalStatus){
      await app.service('v1/advance-salary')._patch(approveData.entityId,{approvalStatus: data.approvalStatus})
    }

		return context;
	};

export default updateApproval;
