import app from '../../../src/app';

describe('\'v1/app-version\' service', () => {
  it('registered the service', () => {
    const service = app.service('v1/app-version');
    expect(service).toBeTruthy();
  });
});
