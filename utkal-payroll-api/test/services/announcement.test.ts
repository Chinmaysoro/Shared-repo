import app from '../../src/app';

describe('\'announcement\' service', () => {
  it('registered the service', () => {
    const service = app.service('announcement');
    expect(service).toBeTruthy();
  });
});
