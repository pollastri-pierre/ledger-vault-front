import reducer, { REMOVE_MESSAGE, closeMessage } from '../../redux/modules/alerts';
import { AUTHENTICATION_FAILED, LOGOUT, CHECK_TEAM_ERROR } from '../../redux/modules/auth';

describe('Module alerts', () => {
  it('closeMessage REMOVE_MESSAGE and id', () => {
    expect(closeMessage('id')).toEqual({
      type: REMOVE_MESSAGE,
      id: 'id',
    });
  });

  it('reducer should remove the messages ', () => {
    const state = [{ id: 'ERROR1' }, { id: 'ERROR2' }];
    const action = { type: REMOVE_MESSAGE, id: 'ERROR1' };
    const stateReduced = [{ id: 'ERROR2' }];

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer handle error 50x', () => {
    const state = [];
    const action = { type: 'A_RANDOM_ERROR', status: 500 };
    const stateReduced = [{ id: 'A_RANDOM_ERROR', type: 'error', title: 'error.error5xTitle', content: 'error.error5xContent' }];

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should return the state when default is catched', () => {
    const state = { test: '1' };
    const action = { type: 'ACTION_NOT_EXIST' };

    expect(reducer(state, action)).toEqual(state);
  });

  it('reducer should handle CHECK_TEAM_ERROR', () => {
    const state = [];
    const action = { type: CHECK_TEAM_ERROR };
    const stateReduced = [{
      id: CHECK_TEAM_ERROR,
      type: 'error',
      title: 'login.wrongDomainTitle',
      content: 'login.wrongDomainMessage',
    }];
    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should handle AUTHENTICATION_FAILED', () => {
    const state = [];
    const action = { type: AUTHENTICATION_FAILED };
    const stateReduced = [{
      id: AUTHENTICATION_FAILED,
      type: 'error',
      title: 'login.wrongDomainTitle',
      content: 'login.wrongDomainMessage',
    }];

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should handle LOGOUT', () => {
    const state = [];
    const action = { type: LOGOUT };
    const stateReduced = [{
      id: LOGOUT,
      type: 'success',
      title: 'login.logoutTitle',
      content: 'login.logoutMessage',
    }];

    expect(reducer(state, action)).toEqual(stateReduced);
  });
});

