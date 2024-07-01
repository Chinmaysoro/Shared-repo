import app from '../../src/app';

describe('\'pay-group\' service', () => {
  it('registered the service', () => {
    const service = app.service('pay-group');
    expect(service).toBeTruthy();
  });
});
