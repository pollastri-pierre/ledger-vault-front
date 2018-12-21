jest.mock("network", () => jest.fn());
import network from "network";
import { ADD_MESSAGE } from "redux/modules/alerts";
import reducer, {
  ONBOARDING_WRAPPING_CHANNEL,
  ONBOARDING_REGISTERING_CHALLENGE,
  ONBOARDING_SIGNIN_CHALLENGE,
  ONBOARDING_TOGGLE_DEVICE_MODAL,
  ONBOARDING_TOGGLE_MEMBER_MODAL,
  NEXT_STEP,
  ONBOARDING_STATE,
  ONBOARDING_ADD_WRAP_KEY,
  ONBOARDING_CHANGE_QUORUM,
  ONBOARDING_ADD_ADMIN,
  ONBOARDING_ADD_SIGNEDIN,
  ONBOARDING_MASTERSEED_CHANNEL,
  ONBOARDING_ADD_MASTERSEED_KEY,
  changeQuorum,
  toggleMemberModal,
  toggleDeviceModal,
  getChallenge,
  authenticate,
  nextState,
  openWrappingChannel,
  addWrappingKey,
  getRegistrationChallenge,
  addMember,
  getSigninChallenge,
  addSignedIn,
  openProvisionningChannel,
  addMasterSeedKey,
  getState
} from "redux/modules/onboarding";

beforeEach(() => {});

test("changeQuorum should send ONBOARDING_CHANGE_QUORUM and the step nb", () => {
  expect(changeQuorum(2)).toEqual({
    type: ONBOARDING_CHANGE_QUORUM,
    nb: 2
  });
});

test("toggleDeviceModal should send ONBOARDING_TOGGLE_DEVICE_MODAL", () => {
  expect(toggleDeviceModal()).toEqual({
    type: ONBOARDING_TOGGLE_DEVICE_MODAL
  });
});

test("toggleMemberModal should send ONBOARDING_TOGGLE_MEMBER_MODAL", () => {
  expect(toggleMemberModal()).toEqual({
    type: ONBOARDING_TOGGLE_MEMBER_MODAL
  });
});

test("getChallenge should call network", () => {
  const step = { current_step: "ADMINISTRATORS_REGISTRATION" };
  getChallenge(step);
  expect(network).toHaveBeenCalledWith("/onboarding/challenge", "POST", step);
});

test("authenticate should call network", () => {
  const data = { test: 1 };
  authenticate(data);
  expect(network).toHaveBeenCalledWith(
    "/onboarding/authenticate",
    "POST",
    data
  );
});

test("nextState should call network and dispatch NEXT_STEP", async () => {
  const data = { test: 1 };
  const dispatch = jest.fn();
  const thunk = nextState(data);
  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_PREREQUISITE" }
  });
  await thunk(dispatch, getstate);
  expect(network).toHaveBeenCalledWith("/onboarding/next", "POST", data);
  expect(dispatch).toHaveBeenCalledWith({ type: NEXT_STEP });
});

test("openWrappingChannel should call network challenge and dispatch ONBOARDING_WRAPPING_CHANNEL", async () => {
  const dispatch = jest.fn();
  const thunk = openWrappingChannel();
  network.mockImplementation(() => "wrapping");
  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_PREREQUISITE" }
  });
  const data = { current_step: getstate()["onboarding"]["state"] };
  await thunk(dispatch, getstate);
  expect(network).toHaveBeenCalledWith("/onboarding/challenge", "POST", data);
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_WRAPPING_CHANNEL,
    wrapping: "wrapping"
  });
});

test("addWrappingKey should call network authenticate and dispatch ONBOARDING_ADD_WRAP_KEY", async () => {
  let data = { id: 1 };
  const dispatch = jest.fn();
  const thunk = addWrappingKey(data);
  network.mockImplementation(() => "key");
  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_REGISTRATION" }
  });
  data["current_step"] = getstate()["onboarding"]["state"];
  await thunk(dispatch, getstate);
  expect(network).toHaveBeenCalledWith(
    "/onboarding/authenticate",
    "POST",
    data
  );
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_ADD_WRAP_KEY,
    add_wrap: "key"
  });
});

test("getRegistrationChallenge should call network challenge and dispatch ONBOARDING_REGISTERING_CHALLENGE", async () => {
  const dispatch = jest.fn();
  const thunk = getRegistrationChallenge();
  network.mockImplementation(() => ({ challenge: "challenge" }));
  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_REGISTRATION" }
  });
  let data = { current_step: getstate()["onboarding"]["state"] };
  await thunk(dispatch, getstate);
  expect(network).toHaveBeenCalledWith("/onboarding/challenge", "POST", data);
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_REGISTERING_CHALLENGE,
    challenge: "challenge"
  });
});

test("addMember should NOT call network authenticate and dispatch ONBOARDING_ADD_ADMIN if already registered", async () => {
  const data = { pub_key: "pubKey" };
  const dispatch = jest.fn();
  const getstate = () => ({
    onboarding: { registering: { admins: [{ pub_key: "pubKey" }] } }
  });
  const thunk = addMember(data);

  try {
    await thunk(dispatch, getstate);
  } catch (e) {
    // console.error(e);
    expect(dispatch).toHaveBeenCalledWith({
      type: ADD_MESSAGE,
      content: "Device already registered",
      messageType: "error",
      title: "Error"
    });
  }
});

test("addMember should call network authenticate and dispatch ONBOARDING_ADD_ADMIN", async () => {
  network.mockImplementation(() => ({ admins: [] }));
  const data = { id: 1 };
  const dispatch = jest.fn();
  const getstate = () => ({ onboarding: { registering: { admins: [] } } });
  const thunk = addMember(data);

  await thunk(dispatch, getstate);
  expect(network).toHaveBeenCalledWith(
    "/onboarding/authenticate",
    "POST",
    data
  );
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_ADD_ADMIN,
    admins: { admins: [] }
  });
});

test("getSigninChallenge should call network challenge and dispatch ONBOARDING_SIGNIN_CHALLENGE", async () => {
  const dispatch = jest.fn();
  const thunk = getSigninChallenge();
  network.mockImplementation(() => "challenge");
  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_REGISTRATION" }
  });
  await thunk(dispatch, getstate);
  let data = { current_step: getstate()["onboarding"]["state"] };
  expect(network).toHaveBeenCalledWith("/onboarding/challenge", "POST", data);
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_SIGNIN_CHALLENGE,
    challenge: "challenge"
  });
});

test("addSignedin should NOT call network authenticate and dispatch ONBOARDING_ADD_SIGNEDIN if already signed", async () => {
  const dispatch = jest.fn();
  const getstate = () => ({
    onboarding: { signin: { admins: ["PUBKEY"] } }
  });
  const thunk = addSignedIn("pubKey", "signature");

  try {
    await thunk(dispatch, getstate);
  } catch (e) {
    // console.error(e);
    expect(dispatch).toHaveBeenCalledWith({
      type: ADD_MESSAGE,
      content: "This device has already been authenticated",
      messageType: "error",
      title: "Error"
    });
  }
});

test("addSignedIn should call network authenticate and dispatch ONBOARDING_ADD_SIGNEDIN", async () => {
  const dispatch = jest.fn();
  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_REGISTRATION", signin: { admins: [] } }
  });
  const thunk = addSignedIn("pub_key", { rawResponse: "signature" });

  await thunk(dispatch, getstate);
  expect(network).toHaveBeenCalledWith("/onboarding/authenticate", "POST", {
    pub_key: "PUB_KEY",
    authentication: "signature",
    current_step: "ADMINISTRATORS_REGISTRATION"
  });
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_ADD_SIGNEDIN,
    data: {
      pub_key: "PUB_KEY",
      authentication: "signature"
    }
  });
});

test("openProvisionningChannel should call network challenge and dispatch ONBOARDING_MASTERSEED_CHANNEL", async () => {
  const dispatch = jest.fn();
  const thunk = openProvisionningChannel();
  network.mockImplementation(() => "challenge");
  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_REGISTRATION" }
  });
  const data = { current_step: getstate()["onboarding"]["state"] };
  await thunk(dispatch, getstate);
  expect(network).toHaveBeenCalledWith("/onboarding/challenge", "POST", data);
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_MASTERSEED_CHANNEL,
    channels: "challenge"
  });
});

test("addMasterSeedKey should call authenticate and ONBOARDING_ADD_MASTERSEED_KEY", async () => {
  let data = { id: 1 };
  const dispatch = jest.fn();
  const thunk = addMasterSeedKey(data);
  network.mockImplementation(() => "seed");

  const getstate = () => ({
    onboarding: { state: "ADMINISTRATORS_REGISTRATION" }
  });
  data["current_step"] = getstate()["onboarding"]["state"];
  await thunk(dispatch, getstate);

  expect(network).toHaveBeenCalledWith(
    "/onboarding/authenticate",
    "POST",
    data
  );

  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_ADD_MASTERSEED_KEY,
    add_seed: "seed"
  });
});

test("getState should call network state  and dispatch ONBOARDING_STATE", async () => {
  const dispatch = jest.fn();
  const thunk = getState();
  network.mockImplementation(() => "state");

  await thunk(dispatch);
  expect(network).toHaveBeenCalledWith("/onboarding/state", "GET");
  expect(dispatch).toHaveBeenCalledWith({
    type: ONBOARDING_STATE,
    state: "state"
  });
});

// reducer
test("when ONBOARDING_TOGGLE_DEVICE_MODAL set device_modal to false/true", () => {
  const state = { device_modal: false };
  expect(reducer(state, { type: ONBOARDING_TOGGLE_DEVICE_MODAL })).toEqual({
    device_modal: true
  });
});

test("when ONBOARDING_TOGGLE_MEMBER_MODAL set member_modal to false/true", () => {
  const state = { member_modal: false };
  expect(reducer(state, { type: ONBOARDING_TOGGLE_MEMBER_MODAL })).toEqual({
    member_modal: true
  });
});

test("when ONBOARDING_CHANGE_QUORUM set quorum", () => {
  const admins = [1, 2];
  const state = { quorum: 0, registering: { admins: admins } };
  expect(reducer(state, { type: ONBOARDING_CHANGE_QUORUM, nb: 2 })).toEqual({
    quorum: 2,
    registering: {
      admins: admins
    }
  });
});

test("when ONBOARDING_CHANGE_QUORUM do not set quorum if too large", () => {
  const admins = [1, 2];
  const state = { quorum: 0, registering: { admins: admins } };
  expect(reducer(state, { type: ONBOARDING_CHANGE_QUORUM, nb: 3 })).toEqual({
    quorum: 0,
    registering: {
      admins: admins
    }
  });
});
