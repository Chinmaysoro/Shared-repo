import app from '../../src/app';

describe('\'Attendance\' service', () => {
  it('registered the service', () => {
    const service = app.service('attendance');
    expect(service).toBeTruthy();
  });
});
