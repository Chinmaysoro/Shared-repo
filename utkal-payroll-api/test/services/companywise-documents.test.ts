import app from '../../src/app';

describe('\'companywise-documents\' service', () => {
  it('registered the service', () => {
    const service = app.service('companywise-documents');
    expect(service).toBeTruthy();
  });
});
