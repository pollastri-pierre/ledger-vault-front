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

  it('getOrganizationApproversStart should return GET_ORGANIZATION_APPROVERS_START', () => {
    expect(module.getOrganizationApproversStart()).toEqual({
      type: module.GET_ORGANIZATION_APPROVERS_START,
    });
  });

  it('gotOrganizationApprovers should return GOT_ORGANIZATION_APPROVERS and members', () => {
    expect(module.gotOrganizationApprovers([])).toEqual({
      type: module.GOT_ORGANIZATION_APPROVERS,
      approvers: [],
    });
  });

  it('gotOrganizationApproversFail should return GOT_ORGANIZATION_APPROVERS_FAIL', () => {
    expect(module.gotOrganizationApproversFail()).toEqual({
      type: module.GOT_ORGANIZATION_APPROVERS_FAIL,
    });
  });

  /* testing reducer */

  it('reducer should set isLoadingApprovers to true when GET_ORGANIZATION_APPROVERS_START', () => {
    expect(reducer(module.initialState, {
      type: module.GET_ORGANIZATION_APPROVERS_START,
    })).toEqual({
      ...module.initialState, isLoadingApprovers: true,
    });
  });

  it('reducer should set isLoadingApprovers to false WHEN GOT_ORGANIZATION_APPROVERS_FAIL', () => {
    const state = { ...module.initialState, isLoadingApprovers: true };
    expect(reducer(state, { type: module.GOT_ORGANIZATION_APPROVERS_FAIL })).toEqual({
      ...module.initialState, isLoadingApprovers: false,
    });
  });

  it('reducer should set the members when GOT_ORGANIZATION_APPROVERS and set isLoadingApprovers to false', () => {
    const state = { ...module.initialState, isLoadingApprovers: true };
    expect(reducer(state, { type: module.GOT_ORGANIZATION_APPROVERS, approvers: [] })).toEqual({
      ...module.initialState, isLoadingApprovers: false, approvers: [],
    });
  });

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
