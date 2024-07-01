import app from '../../src/app';

describe('\'pay-components\' service', () => {
  it('registered the service', () => {
    const service = app.service('pay-components');
    expect(service).toBeTruthy();
  });
});
