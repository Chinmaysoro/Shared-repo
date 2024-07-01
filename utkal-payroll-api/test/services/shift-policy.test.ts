import app from '../../src/app';

describe('\'shift-policy\' service', () => {
  it('registered the service', () => {
    const service = app.service('shift-policy');
    expect(service).toBeTruthy();
  });
});
