import app from '../../src/app';

describe('\'payslip\' service', () => {
  it('registered the service', () => {
    const service = app.service('payslip');
    expect(service).toBeTruthy();
  });
});
