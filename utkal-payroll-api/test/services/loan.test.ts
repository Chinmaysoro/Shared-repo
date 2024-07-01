import app from '../../src/app';

describe('\'loan\' service', () => {
  it('registered the service', () => {
    const service = app.service('loan');
    expect(service).toBeTruthy();
  });
});
