import app from '../../src/app';

describe('\'user-documents\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-documents');
    expect(service).toBeTruthy();
  });
});
