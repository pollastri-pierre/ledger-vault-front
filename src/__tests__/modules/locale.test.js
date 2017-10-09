import reducer, { SWITCH_LANG, switchLocale, switchLang } from '../../redux/modules/locale';
import LocalStorageMock from '../../utils/LocalStorageMock';

describe('Module locale', () => {
  it('reducer should set the language', () => {
    const state = 'en';
    const action = { type: SWITCH_LANG, lang: 'fr' };
    const stateReduced = 'fr';

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('switchLocale() should send SWITCH_LANG with fr language', () => {
    global.localStorage = new LocalStorageMock();
    const dispatch = jest.fn();
    const getState = () => ({
      locale: 'en',
    });
    const thunk = switchLocale();

    thunk(dispatch, getState);

    const calls = dispatch.mock.calls;
    expect(calls[0][0]).toEqual({ type: SWITCH_LANG, lang: 'fr' });
  });

  it('switchLang() should send SWITCH_LANG with en', () => {
    expect(switchLang('en')).toEqual({
      type: SWITCH_LANG,
      lang: 'en',
    });
  });

  it('switchLang() should send SWITCH_LANG with fr', () => {
    expect(switchLang('fr')).toEqual({
      type: SWITCH_LANG,
      lang: 'fr',
    });
  });

  it('reducer should return the state when default is catched', () => {
    const state = { test: '1' };
    const action = { type: 'ACTION_NOT_EXIST' };

    expect(reducer(state, action)).toEqual(state);
  });
});

