import app from '../../src/app';

describe('\'grade\' service', () => {
  it('registered the service', () => {
    const service = app.service('grade');
    expect(service).toBeTruthy();
  });
});
