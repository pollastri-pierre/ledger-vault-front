import moxios from 'moxios';
import reducer from '../../redux/modules/profile';
import { GOT_USER_INFO, LOGOUT } from '../../redux/modules/auth';

describe('Module profile', () => {
  it('reducer should set the user infos', () => {
    const state = {};
    const action = {type: GOT_USER_INFO, user: {id: '1'}};
    const stateReduced = {id: '1'};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should reset the user at LOGOUT', () => {
    const state = {id: '1'};
    const action = {type: LOGOUT};
    const stateReduced = {};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

});

