import app from '../../src/app';

describe('\'salary-component\' service', () => {
  it('registered the service', () => {
    const service = app.service('salary-component');
    expect(service).toBeTruthy();
  });
});
