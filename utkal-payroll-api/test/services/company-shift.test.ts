import app from '../../src/app';

describe('\'company-shift\' service', () => {
  it('registered the service', () => {
    const service = app.service('company-shift');
    expect(service).toBeTruthy();
  });
});
