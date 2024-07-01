import app from '../../src/app';

describe('\'firebase-notification\' service', () => {
  it('registered the service', () => {
    const service = app.service('firebase-notification');
    expect(service).toBeTruthy();
  });
});
