import app from '../../src/app';

describe('\'leave-policy\' service', () => {
  it('registered the service', () => {
    const service = app.service('leave-policy');
    expect(service).toBeTruthy();
  });
});
