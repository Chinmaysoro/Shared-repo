import app from '../../src/app';

describe('\'dashboard-filter\' service', () => {
  it('registered the service', () => {
    const service = app.service('dashboard-filter');
    expect(service).toBeTruthy();
  });
});
