import accountCreation, * as module from "./account-creation";
import { LOGOUT } from "./auth";

test("openPoopBubble should return OPEN_POPBUBBLE and anchor", () => {
  expect(module.openPopBubble({})).toEqual({
    type: module.OPEN_POPBUBBLE,
    anchor: {}
  });
});

test("setTimelock should return SET_TIMELOCK and timelock", () => {
  expect(module.setTimelock({})).toEqual({
    type: module.SET_TIMELOCK,
    timelock: {}
  });
});

test("setRateLimiter should return SET_RATELIMITER and ratelimiter", () => {
  expect(module.setRatelimiter({})).toEqual({
    type: module.SET_RATELIMITER,
    ratelimiter: {}
  });
});

test("addMember should return ADD_MEMBER and member", () => {
  expect(module.addMember({ id: 1 })).toEqual({
    type: module.ADD_MEMBER,
    member: { id: 1 }
  });
});

test("removeMember should return REMOVE_MEMBER and member", () => {
  expect(module.removeMember({ id: 1 })).toEqual({
    type: module.REMOVE_MEMBER,
    member: { id: 1 }
  });
});

test("setApprovals should return SET_APPROVALS and number", () => {
  expect(module.setApprovals(1)).toEqual({
    type: module.SET_APPROVALS,
    number: 1
  });
});

test("clearState should return CLEAR_STATE", () => {
  expect(module.clearState()).toEqual({
    type: module.CLEAR_STATE
  });
});

test("changeTab sould send CHANGE_TAB and index", () => {
  expect(module.changeTab(1)).toEqual({
    type: module.CHANGE_TAB,
    index: 1
  });
});

test("selectCurrencyItem should send SELECT_CURRENCY and currency", () => {
  expect(module.selectCurrencyItem({ id: 1 })).toEqual({
    type: module.SELECT_CURRENCY,
    currency: { id: 1 }
  });
});

test("changeAccountName should send CHANGE_ACCOUNT_NAME and name if inferior to MAX_ACCOUNT_NAME_LENGTH", () => {
  expect(module.changeAccountName("name")).toEqual({
    type: module.CHANGE_ACCOUNT_NAME,
    name: "name"
  });
});

test("changeAccountName should NOT send CHANGE_ACCOUNT_NAME and name if superior to MAX_ACCOUNT_NAME_LENGTH", () => {
  expect(
    module.changeAccountName("namenamenamenamenamenamenedsfsdfdsk")
  ).toEqual(undefined);
});

test("switchInternalModal should send SWITCH_INTERN_MODAL and id", () => {
  expect(module.switchInternalModal("id")).toEqual({
    type: module.SWITCH_INTERN_MODAL,
    id: "id"
  });
});

test("selectCurrency should dispatch selectCurrencyItem and changeTab", () => {
  const dispatch = jest.fn();
  const thunk = module.selectCurrency({ id: 1 });
  thunk(dispatch);
  expect(dispatch).toHaveBeenCalledWith(module.selectCurrencyItem({ id: 1 }));
  expect(dispatch).toHaveBeenCalledWith(module.changeTab(1));
});

// testing the reducer now
test("clearState should return the initialState", () => {
  expect(
    accountCreation(
      { ...module.initialState, quorum: 1 },
      { type: module.CLEAR_STATE }
    )
  ).toEqual(module.initialState);
});
//
test("changeName should update the name in state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.CHANGE_ACCOUNT_NAME,
      name: "name_update"
    })
  ).toEqual({ ...module.initialState, name: "name_update" });
});

test("switchInterModal should update the internModalId in state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.SWITCH_INTERN_MODAL,
      id: "idintern"
    })
  ).toEqual({ ...module.initialState, internModalId: "idintern" });
});

test("changeTab should update the curruntTab in state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.CHANGE_TAB,
      index: 2
    })
  ).toEqual({ ...module.initialState, currentTab: 2 });
});

test("selectCurrency should update the currency in state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.SELECT_CURRENCY,
      currency: { id: 1 }
    })
  ).toEqual({ ...module.initialState, currency: { id: 1 } });
});

test("setTimelock should update the time_lock in state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.SET_TIMELOCK,
      timelock: { id: 1 }
    })
  ).toEqual({ ...module.initialState, time_lock: { id: 1 } });
});

test("setRatelimiter should update the rate_limiter in state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.SET_RATELIMITER,
      ratelimiter: { id: 1 }
    })
  ).toEqual({ ...module.initialState, rate_limiter: { id: 1 } });
});

test("when user logouts we should empty the state", () => {
  expect(
    accountCreation(
      { ...module.initialState, currentTab: 2 },
      {
        type: LOGOUT
      }
    )
  ).toEqual(module.initialState);
});
test("we should return the state given if no match", () => {
  expect(
    accountCreation(
      { ...module.initialState, currentTab: 2 },
      {
        type: "UNKOWN"
      }
    )
  ).toEqual({ ...module.initialState, currentTab: 2 });
});

test("openPopBubble should update popBubble and popAnchor", () => {
  expect(
    accountCreation(
      { ...module.initialState, currentTab: 2 },
      {
        type: module.OPEN_POPBUBBLE,
        anchor: {}
      }
    )
  ).toEqual({
    ...module.initialState,
    currentTab: 2,
    popBubble: !module.initialState.popBubble,
    popAnchor: {}
  });
});

test("openPopBubble should not update popAnchor if it's a string", () => {
  expect(
    accountCreation(
      { ...module.initialState, currentTab: 2 },
      {
        type: module.OPEN_POPBUBBLE,
        anchor: ""
      }
    )
  ).toEqual({
    ...module.initialState,
    currentTab: 2,
    popBubble: !module.initialState.popBubble
  });
});

test("setApproval should update the quorum in the state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.SET_APPROVALS,
      number: 3
    })
  ).toEqual({
    ...module.initialState,
    quorum: 3
  });
});

test("setApproval should  not update the quorum in the state if its not a number", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.SET_APPROVALS,
      number: "3a"
    })
  ).toEqual(module.initialState);
});

test("addMember should add the member in approvers array in the state", () => {
  expect(
    accountCreation(module.initialState, {
      type: module.ADD_MEMBER,
      member: "pubKey"
    })
  ).toEqual({ ...module.initialState, approvers: ["pubKey"] });
});

test("addMember should remove the member in approvers array in the state if already exists", () => {
  expect(
    accountCreation(
      { ...module.initialState, approvers: ["pubKey"] },
      {
        type: module.ADD_MEMBER,
        member: "pubKey"
      }
    )
  ).toEqual({ ...module.initialState, approvers: [] });
});

test("addMember should reset the quorum to 0 if members length is inferior", () => {
  expect(
    accountCreation(
      { ...module.initialState, approvers: ["pubKey", "pubKey2"], quorum: 2 },
      {
        type: module.ADD_MEMBER,
        member: "pubKey"
      }
    )
  ).toEqual({ ...module.initialState, approvers: ["pubKey2"], quorum: 0 });
});
