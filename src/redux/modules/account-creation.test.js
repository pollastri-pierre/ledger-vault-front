import accountCreation, * as module from "./account-creation";
import { LOGOUT } from "./auth";

test("updateCreationState should update the state", () => {
  const updater = () => ({ name: "test" });
  expect(
    accountCreation(module.initialState, {
      type: "account-creation/UPDATE_STATE",
      updater
    })
  ).toEqual({
    ...module.initialState,
    name: "test"
  });
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
