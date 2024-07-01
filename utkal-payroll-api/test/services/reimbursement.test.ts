import app from '../../src/app';

describe('\'reimbursement\' service', () => {
  it('registered the service', () => {
    const service = app.service('reimbursement');
    expect(service).toBeTruthy();
  });
});
