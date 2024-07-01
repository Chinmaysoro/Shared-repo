import app from '../../src/app';

describe('\'user-otp\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-otp');
    expect(service).toBeTruthy();
  });
});
