import moxios from 'moxios';
import reducer, { OPEN_CLOSE_PROFILE, OPEN_CLOSE_EDIT, CLOSE_EDIT, OPEN_EDIT, openCloseEdit, openCloseProfile, initialState } from '../../redux/modules/profile';
import { GOT_USER_INFO, LOGOUT } from '../../redux/modules/auth';

describe('Module profile', () => {

  it('openCloseProfile should return OPEN_CLOSE_PROFILE', () => {
    expect(openCloseProfile('target')).toEqual({
      type: OPEN_CLOSE_PROFILE,
      target: 'target',
    });
  });

  it('openCloseEdit should return OPEN_EDIT if openEdit is false', () => {
    const thunk = openCloseEdit();
    const dispatch = jest.fn();

    const getState = () => ({
      profile: {
        openEdit: false,
      },
    });
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({type: OPEN_EDIT});
  });

  it('openCloseEdit should return CLOSE_EDIT if openEdit is true', () => {
    const thunk = openCloseEdit();
    const dispatch = jest.fn();

    const getState = () => ({
      profile: {
        openEdit: true,
      },
    });
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({type: CLOSE_EDIT});
  });

  it('reducer should set the user infos', () => {
    const state = initialState;
    const action = {type: GOT_USER_INFO, user: {id: '1'}};
    const stateReduced = {...initialState, user: {id: '1'}};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should reset the user at LOGOUT', () => {
    const state = {user: {id: '1'}, open: false};
    const action = {type: LOGOUT};
    const stateReduced = initialState;

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the open to true', () => {
    const state = initialState;
    const action = {type: OPEN_CLOSE_PROFILE, target: {}};
    const stateReduced = {...initialState, open: true, target: {}};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the open to false', () => {
    const state = {...initialState, open: true};
    const action = {type: OPEN_CLOSE_PROFILE};
    const stateReduced = {...initialState, open: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer set openEdit to false when OPEN_CLOSE_EDIT', () => {
    const state = {...initialState, openEdit: true};
    const action = {type: CLOSE_EDIT};
    const stateReduced = {...initialState, openEdit: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer set openEdit to true when OPEN_CLOSE_EDIT', () => {
    const state = {...initialState, openEdit: false};
    const action = {type: OPEN_EDIT};
    const stateReduced = {...initialState, openEdit: true};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should return the state when default is catched', () => {
    const state = { test: '1' };
    const action = {type: 'ACTION_NOT_EXIST'};

    expect(reducer(state, action)).toEqual(state);
  });

});

