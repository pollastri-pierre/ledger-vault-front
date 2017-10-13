import { LOGOUT } from '../../redux/modules/auth';

import reducer, {
  initialState,
  getAccountToApprove,
  getAccountToApproveStart,
  gotAccountToApprove,
  gotAccountToApproveFail,
  openAccountApprove,
  closeAccountApprove,
  GET_ACCOUNT_TO_APPROVE_START,
  GOT_ACCOUNT_TO_APPROVE,
  GOT_ACCOUNT_TO_APPROVE_FAIL,
  OPEN_ACCOUNT_APPROVE,
  CLOSE_ACCOUNT_APPROVE,
} from '../../redux/modules/account-approve';

describe('account-approve module', () => {
  it('getAccountToApproveStart() should return GET_ACCOUNT_TO_APPROVE_START', () => {
    expect(getAccountToApproveStart()).toEqual({
      type: GET_ACCOUNT_TO_APPROVE_START,
    });
  });

  it('gotAccountToApprove() should return GOT_ACCOUNT_TO_APPROVE and account', () => {
    expect(gotAccountToApprove({})).toEqual({
      type: GOT_ACCOUNT_TO_APPROVE,
      account: {},
    });
  });

  it('gotAccountToApproveFail() should return GOT_ACCOUNT_TO_APPROVE_FAIL and status', () => {
    expect(gotAccountToApproveFail(300)).toEqual({
      type: GOT_ACCOUNT_TO_APPROVE_FAIL,
      status: 300,
    });
  });

  it('openAccountApprove() should return OPEN_ACCOUNT_APPROVE and accountId', () => {
    expect(openAccountApprove(300)).toEqual({
      type: OPEN_ACCOUNT_APPROVE,
      accountId: 300,
      isApproved: false,
    });
  });

  it('closeAccountApprove() should return CLOSE_ACCOUNT_APPROVE', () => {
    expect(closeAccountApprove()).toEqual({
      type: CLOSE_ACCOUNT_APPROVE,
    });
  });


  // testing reducers

  it('reducer should set isLoading to true when GET_ACCOUNT_TO_APPROVE_START', () => {
    expect(reducer(initialState, {
      type: GET_ACCOUNT_TO_APPROVE_START,
    })).toEqual({ ...initialState, isLoading: true });
  });

  it('reducer should set isLoading to false and set the account at GOT_ACCOUNT_TO_APPROVE', () => {
    const state = { ...initialState, isLoading: true };
    expect(reducer(state, {
      type: GOT_ACCOUNT_TO_APPROVE,
      account: {},
    })).toEqual({ ...state, isLoading: false, account: {} });
  });

  it('reducer should set isLoading to false when GOT_ACCOUNT_TO_APPROVE_FAIL', () => {
    const state = { ...initialState, isLoading: true };
    expect(reducer(state, {
      type: GOT_ACCOUNT_TO_APPROVE_FAIL,
      status: 400,
    })).toEqual({ ...state, isLoading: false });
  });

  it('reducer should set modalOpened to true and set the accountId when OPEN_ACCOUNT_APPROVE', () => {
    expect(reducer(initialState, {
      type: OPEN_ACCOUNT_APPROVE,
      accountId: 400,
      isApproved: false,
    })).toEqual({ ...initialState, modalOpened: true, accountId: 400, isApproved: false });
  });

  it('reducer should reset modalOpend and accountId when CLOSE_ACCOUNT_APPROVE', () => {
    const state = { ...initialState, modalOpened: true, accountId: 3 };

    expect(reducer(state, {
      type: CLOSE_ACCOUNT_APPROVE,
    })).toEqual({ ...state, modalOpened: false, accountId: null });
  });

  it('reducer should reset the state at LOGOUT', () => {
    const state = { ...initialState, data: {} };
    expect(reducer(state, {
      type: LOGOUT,
    })).toEqual(initialState);
  });
});
