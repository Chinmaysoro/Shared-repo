import app from '../../src/app';

describe('\'user-salary\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-salary');
    expect(service).toBeTruthy();
  });
});
