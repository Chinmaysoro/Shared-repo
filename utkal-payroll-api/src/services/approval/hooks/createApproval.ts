import { Hook, HookContext } from '@feathersjs/feathers';


const createApproval =
	(): Hook =>
	async (context: HookContext): Promise<HookContext> => {
		const { app, params, result } = context;
		const { user } = params;
    const approvalService = app.service('v1/approval');
    let obj = {}
      obj['userId'] = user?._id,
      obj['approverId'] = user?.manager,
      obj['approveId'] = user?._id,
      obj['entityId'] = result._id,
      obj['companyId'] = user?.companyId,
      obj['approvalStatus'] = result?.approvalStatus
    if(context.path === 'v1/leave'&& context.method === 'create'){
      obj['entityType'] = 'leave'
    }
    if(context.path === 'v1/reimbursement'&& context.method === 'create'){
      obj['entityType'] = 'reimbursement'
    }
    if(context.path === 'v1/resignation'&& context.method === 'create'){
      obj['entityType'] = 'resignation'
    }
    if(context.path === 'v1/advance-salary'&& context.method === 'create'){
      obj['entityType'] = 'advanceSalary'
    }
    await approvalService._create(obj)

		return context;
	};

export default createApproval;
