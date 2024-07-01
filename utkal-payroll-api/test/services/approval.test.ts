import app from '../../src/app';

describe('\'approval\' service', () => {
  it('registered the service', () => {
    const service = app.service('approval');
    expect(service).toBeTruthy();
  });
});
