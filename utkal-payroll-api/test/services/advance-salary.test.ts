import app from '../../src/app';

describe('\'advance-salary\' service', () => {
  it('registered the service', () => {
    const service = app.service('advance-salary');
    expect(service).toBeTruthy();
  });
});
