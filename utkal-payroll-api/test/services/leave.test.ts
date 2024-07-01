import app from '../../src/app';

describe('\'leave\' service', () => {
  it('registered the service', () => {
    const service = app.service('leave');
    expect(service).toBeTruthy();
  });
});
