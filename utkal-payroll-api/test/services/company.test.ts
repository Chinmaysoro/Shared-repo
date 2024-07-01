import app from '../../src/app';

describe('\'company\' service', () => {
  it('registered the service', () => {
    const service = app.service('company');
    expect(service).toBeTruthy();
  });
});
