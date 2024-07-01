import app from '../../src/app';

describe('\'leads\' service', () => {
  it('registered the service', () => {
    const service = app.service('leads');
    expect(service).toBeTruthy();
  });
});
