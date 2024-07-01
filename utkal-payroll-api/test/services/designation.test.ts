import app from '../../src/app';

describe('\'designation\' service', () => {
  it('registered the service', () => {
    const service = app.service('designation');
    expect(service).toBeTruthy();
  });
});
