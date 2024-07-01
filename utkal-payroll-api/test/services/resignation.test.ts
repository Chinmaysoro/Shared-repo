import app from '../../src/app';

describe('\'resignation\' service', () => {
  it('registered the service', () => {
    const service = app.service('resignation');
    expect(service).toBeTruthy();
  });
});
