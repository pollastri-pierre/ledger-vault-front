import { LOGOUT } from '../../redux/modules/auth';
import reducer, * as module from '../../redux/modules/organization';

describe('Module profile', () => {
  it('getOrganizationMembersStart should return GET_ORGANIZATION_MEMBERS_START', () => {
    expect(module.getOrganizationMembersStart()).toEqual({
      type: module.GET_ORGANIZATION_MEMBERS_START,
    });
  });

  it('gotOrganizationMembers should return GOT_ORGANIZATION_MEMBERS and members', () => {
    expect(module.gotOrganizationMembers([])).toEqual({
      type: module.GOT_ORGANIZATION_MEMBERS,
      members: [],
    });
  });

  it('gotOrganizationMembersFail should return GOT_ORGANIZATION_MEMBERS_FAIL', () => {
    expect(module.gotOrganizationMembersFail()).toEqual({
      type: module.GOT_ORGANIZATION_MEMBERS_FAIL,
    });
  });

  /* testing reducer */

  it('reducer should set isLoading to true when GET_ORGANIZATION_MEMBERS_START', () => {
    expect(reducer(module.initialState, { type: module.GET_ORGANIZATION_MEMBERS_START })).toEqual({
      ...module.initialState, isLoading: true,
    });
  });

  it('reducer should set isLoading to false WHEN GOT_ORGANIZATION_MEMBERS_FAIL', () => {
    const state = { ...module.initialState, isLoading: true };
    expect(reducer(state, { type: module.GOT_ORGANIZATION_MEMBERS_FAIL })).toEqual({
      ...module.initialState, isLoading: false,
    });
  });

  it('reducer should set the members when GOT_ORGANIZATION_MEMBERS and set isLoading to false', () => {
    const state = { ...module.initialState, isLoading: true };
    expect(reducer(state, { type: module.GOT_ORGANIZATION_MEMBERS, members: [] })).toEqual({
      ...module.initialState, isLoading: false, members: [],
    });
  });

  it('reducer should reset the state at LOGOUT', () => {
    const state = { ...module.initialState, members: [] };
    expect(reducer(state, { type: LOGOUT })).toEqual(module.initialState);
  });
});
