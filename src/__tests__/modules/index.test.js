import reducers from '../../redux/modules/index';
import alert from '../../redux/modules/alerts';
import blur from '../../redux/modules/blurBG';
import locale from '../../redux/modules/locale';
import profile from '../../redux/modules/profile';
import auth from '../../redux/modules/auth';
import operations from '../../redux/modules/operations';

describe('Index Modules', () => {
  it('index should add blurBG reducer', () => {
    expect(reducers.blurBG).toBe(blur);
  });

  it('index should add profile reducer', () => {
    expect(reducers.profile).toBe(profile);
  });

  it('index should add locale reducer', () => {
    expect(reducers.locale).toBe(locale);
  });

  it('index should add auth reducer', () => {
    expect(reducers.auth).toBe(auth);
  });

  it('index should add alerts reducer', () => {
    expect(reducers.alerts).toBe(alert);
  });

  it('index should add operations reducer', () => {
    expect(reducers.operations).toBe(operations);
  });
});

