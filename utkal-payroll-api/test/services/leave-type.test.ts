import app from '../../src/app';

describe('\'leave-type\' service', () => {
  it('registered the service', () => {
    const service = app.service('leave-type');
    expect(service).toBeTruthy();
  });
});
