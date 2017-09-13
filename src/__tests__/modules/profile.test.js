import moxios from 'moxios';
import reducer, { OPEN_CLOSE_PROFILE, OPEN_CLOSE_EDIT, openCloseEdit, openCloseProfile, initialState } from '../../redux/modules/profile';
import { GOT_USER_INFO, LOGOUT } from '../../redux/modules/auth';

describe('Module profile', () => {

  it('openCloseProfile should return OPEN_CLOSE_PROFILE', () => {
    expect(openCloseProfile('target')).toEqual({
      type: OPEN_CLOSE_PROFILE,
      target: 'target'
    });
  });

  it('openCloseEdit should return OPEN_CLOSE_EDIT', () => {
    expect(openCloseEdit()).toEqual({
      type: OPEN_CLOSE_EDIT
    });
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
    const action = {type: OPEN_CLOSE_PROFILE, target: 'test'};
    const stateReduced = {...initialState, open: true, target: 'test'};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the open to false', () => {
    const state = {...initialState, open: true};
    const action = {type: OPEN_CLOSE_PROFILE};
    const stateReduced = {...initialState, open: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });


});

