import app from '../../src/app';

describe('\'salarySlip\' service', () => {
  it('registered the service', () => {
    const service = app.service('salary-status');
    expect(service).toBeTruthy();
  });
});
