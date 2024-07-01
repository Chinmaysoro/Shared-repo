import app from '../../src/app';

describe('\'leave-balance\' service', () => {
  it('registered the service', () => {
    const service = app.service('leave-balance');
    expect(service).toBeTruthy();
  });
});
