import app from '../../src/app';

describe('\'reimbursement-type\' service', () => {
  it('registered the service', () => {
    const service = app.service('reimbursement-type');
    expect(service).toBeTruthy();
  });
});
