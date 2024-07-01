import app from '../../src/app';

describe('\'holiday-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('holiday-list');
    expect(service).toBeTruthy();
  });
});
