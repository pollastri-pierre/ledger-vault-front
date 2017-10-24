import {LOGOUT} from '../../redux/modules/auth';

import reducer, {
  initialState,
  getAccountToApprove,
  getAccountToApproveStart,
  gotAccountToApprove,
  gotAccountToApproveFail,
  openAccountApprove,
  closeAccountApprove,
  approveStart,
  approved,
  approvedFail,
  finishApprove,
  approving,
  abortStart,
  aborted,
  abortedFail,
  abort,
  aborting,
  GET_ACCOUNT_TO_APPROVE_START,
  GOT_ACCOUNT_TO_APPROVE,
  GOT_ACCOUNT_TO_APPROVE_FAIL,
  OPEN_ACCOUNT_APPROVE,
  CLOSE_ACCOUNT_APPROVE,
  APPROVE_START,
  APPROVED,
  APPROVED_FAIL,
  ABORT_START,
  ABORTING,
  ABORTED_FAIL,
  ABORTED,
} from '../../redux/modules/entity-approve';

describe('entity-approve module', () => {
  // TODO test abort, approving, finishApprove when real API implemented

  it('aborting() should return ABORTING', () => {
    expect(aborting()).toEqual({
      type: ABORTING,
    });
  });

  it('approveStart() should return APPROVE_START', () => {
    expect(approveStart()).toEqual({
      type: APPROVE_START,
    });
  });

  it('abortStart() should return ABORT_START', () => {
    expect(abortStart()).toEqual({
      type: ABORT_START,
    });
  });

  it('abortedFail() should return ABORTED_FAIL', () => {
    expect(abortedFail()).toEqual({
      type: ABORTED_FAIL,
    });
  });

  it('approvedFail() should return APPROVED_FAIL', () => {
    expect(approvedFail()).toEqual({
      type: APPROVED_FAIL,
    });
  });

  it('aborted() should return ABORTED with the accountId', () => {
    expect(aborted(1)).toEqual({
      type: ABORTED,
      accountId: 1,
    });
  });

  it('getAccountToApproveStart() should return GET_ACCOUNT_TO_APPROVE_START', () => {
    expect(getAccountToApproveStart()).toEqual({
      type: GET_ACCOUNT_TO_APPROVE_START,
    });
  });

  it('approved() should return APPROVED and the accountId and the pub_key of current user', () => {
    const dispatch = jest.fn();
    const getState = () => {
      return {
        profile: {
          user: {
            pub_key: 'hash',
          },
        },
      };
    };

    const thunk = approved(1);
    thunk(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({
      type: APPROVED,
      accountId: 1,
      pub_key: 'hash',
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

  it('openAccountApprove() should return OPEN_ACCOUNT_APPROVE and account', () => {
    expect(openAccountApprove({})).toEqual({
      type: OPEN_ACCOUNT_APPROVE,
      account: {},
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
    expect(
      reducer(initialState, {
        type: GET_ACCOUNT_TO_APPROVE_START,
      }),
    ).toEqual({...initialState, isLoading: true});
  });

  it('reducer should set isLoading to false and set the account at GOT_ACCOUNT_TO_APPROVE', () => {
    const state = {...initialState, isLoading: true};
    expect(
      reducer(state, {
        type: GOT_ACCOUNT_TO_APPROVE,
        account: {},
      }),
    ).toEqual({...state, isLoading: false, account: {}});
  });

  it('reducer should set isLoading to false when GOT_ACCOUNT_TO_APPROVE_FAIL', () => {
    const state = {...initialState, isLoading: true};
    expect(
      reducer(state, {
        type: GOT_ACCOUNT_TO_APPROVE_FAIL,
        status: 400,
      }),
    ).toEqual({...state, isLoading: false});
  });

  it('reducer should set modalOpened to true and set the account when OPEN_ACCOUNT_APPROVE', () => {
    expect(
      reducer(initialState, {
        type: OPEN_ACCOUNT_APPROVE,
        account: {},
        isApproved: false,
      }),
    ).toEqual({
      ...initialState,
      modalOpened: true,
      account: {},
      isApproved: false,
      isLoading: true,
    });
  });

  it('reducer should reset modalOpend and accountId when CLOSE_ACCOUNT_APPROVE', () => {
    const state = {...initialState, modalOpened: true, accountId: 3};

    expect(
      reducer(state, {
        type: CLOSE_ACCOUNT_APPROVE,
      }),
    ).toEqual({...state, modalOpened: false, accountId: null});
  });

  it('reducer should set modalOpened to false and isAborting to false at ABORT_START', () => {
    const state = {...initialState, modalOpened: true, isAborting: true};

    expect(
      reducer(state, {
        type: ABORT_START,
      }),
    ).toEqual({...state, modalOpened: false, isAborting: false});
  });

  it('reducer should set isDecive to !state.isDevice at APPROVE_START', () => {
    const state = {...initialState, isDevice: false};
    const state2 = {...initialState, isDevice: true};

    expect(
      reducer(state, {
        type: APPROVE_START,
      }),
    ).toEqual({...state, isDevice: true});

    expect(
      reducer(state2, {
        type: APPROVE_START,
      }),
    ).toEqual({...state, isDevice: false});
  });

  it('reducer should set account to null and accountId to null at ABORTED', () => {
    const state = {...initialState, account: {}, accountId: 1};

    expect(
      reducer(state, {
        type: ABORTED,
      }),
    ).toEqual({...state, account: null, accountId: null});
  });

  it('reducer should reset the state at APPROVED', () => {
    const state = {...initialState, account: {}, accountId: 1};

    expect(
      reducer(state, {
        type: APPROVED,
      }),
    ).toEqual(initialState);
  });

  it('reducer should do set isAborting to !state.isAborting at ABORTING', () => {
    const state = {...initialState, isAborting: false};
    const state2 = {...initialState, isAborting: true};

    expect(
      reducer(state, {
        type: ABORTING,
      }),
    ).toEqual({...state, isAborting: true});

    expect(
      reducer(state2, {
        type: ABORTING,
      }),
    ).toEqual({...state, isAborting: false});
  });

  it('reducer should reset the state at LOGOUT', () => {
    const state = {...initialState, data: {}};
    expect(
      reducer(state, {
        type: LOGOUT,
      }),
    ).toEqual(initialState);
  });
});
