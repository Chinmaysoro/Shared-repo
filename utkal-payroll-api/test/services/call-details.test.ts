import app from '../../src/app';

describe('\'call-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('call-details');
    expect(service).toBeTruthy();
  });
});
