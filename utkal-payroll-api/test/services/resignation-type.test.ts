import app from '../../src/app';

describe('\'resignation-type\' service', () => {
  it('registered the service', () => {
    const service = app.service('resignation-type');
    expect(service).toBeTruthy();
  });
});
