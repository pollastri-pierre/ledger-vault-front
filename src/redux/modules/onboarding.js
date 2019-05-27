// @flow
import network from "network";
import { addMessage } from "redux/modules/alerts";
import type { Dispatch } from "redux";

export const ONBOARDING_WRAPPING_CHANNEL = "ONBOARDING_WRAPPING_CHANNEL";
export const ONBOARDING_FATAL_ERROR = "ONBOARDING_FATAL_ERROR";
export const ONBOARDING_REGISTERING_CHALLENGE =
  "ONBOARDING_REGISTERING_CHALLENGE";
export const ONBOARDING_SHARED_OWNER_REGISTERING_CHALLENGE =
  "ONBOARDING_SHARED_OWNER_REGISTERING_CHALLENGE";
export const ONBOARDING_SIGNIN_CHALLENGE = "ONBOARDING_SIGNIN_CHALLENGE";
export const ONBOARDING_TOGGLE_DEVICE_MODAL = "ONBOARDING_TOGGLE_DEVICE_MODAL";
export const ONBOARDING_TOGGLE_MEMBER_MODAL = "ONBOARDING_TOGGLE_MEMBER_MODAL";
export const NEXT_STEP = "NEXT_STEP";
export const PREVIOUS_STEP = "PREVIOUS_STEP";
export const ONBOARDING_STATE = "ONBOARDING_STATE";
export const ONBOARDING_ADD_WRAP_KEY = "ONBOARDING_ADD_WRAP_KEY";
export const ONBOARDING_CHANGE_QUORUM = "ONBOARDING_CHANGE_QUORUM";
export const ONBOARDING_ADD_ADMIN = "ONBOARDING_ADD_ADMIN";
export const ONBOARDING_ADMIN_VALIDATION_CHANNEL =
  "ONBOARDING_ADD_ADMIN_VALIDATION_CHANNEL";
export const ONBOARDING_ADD_ADMIN_VALIDATION =
  "ONBOARDING_ADD_ADMIN_VALIDATION";
export const ONBOARDING_ADD_SIGNEDIN = "ONBOARDING_ADD_SIGNEDIN";
export const ONBOARDING_MASTERSEED_CHANNEL = "ONBOARDING_MASTERSEED_CHANNEL";
export const ONBOARDING_ADD_MASTERSEED_KEY = "ONBOARDING_ADD_MASTERSEED_KEY";
export const ONBOARDING_ADD_SHARED_OWNER = "ONBOARDING_ADD_SHARED_OWNER";

export type OnboardingState =
  | "LOADING"
  | "EMPTY_PARTITION"
  | "WRAPPING_KEY_PREREQUISITES"
  | "WRAPPING_KEY_CONFIGURATION"
  | "WRAPPING_KEY_BACKUP"
  | "WRAPPING_KEY_SIGN_IN"
  | "ADMINISTRATORS_PREREQUISITE"
  | "ADMINISTRATORS_CONFIGURATION"
  | "ADMINISTRATORS_REGISTRATION"
  | "ADMINISTRATORS_SCHEME_CONFIGURATION"
  // | "ADMINISTRATORS_SIGN_IN"
  | "MASTER_SEED_PREREQUISITE"
  | "MASTER_SEED_CONFIGURATION"
  | "MASTER_SEED_BACKUP"
  | "SHARED_OWNER_REGISTRATION"
  | "SHARED_OWNER_VALIDATION"
  | "MASTER_SEED_GENERATION"
  | "COMPLETE";

type KeyHandle = { [_: string]: string };

type Challenge = {
  challenge: string,
  key_handle?: KeyHandle,
};

type Channel = {
  ephemeral_public_key: string,
  certificate: string,
};

type Blob = {
  ephemeral_public_key: string,
  certificate: string,
  blob: string,
};

type Admin = $Shape<{
  uid: string,
  id: number,
  public_key: string,
  user_name: string,
  email: string,
  key_handle: string,
  validation: Object,
  u2f_register: Object,
}>;

type Wrapping = {
  channel?: Channel,
  blobs: Blob[],
};
type Provisionning = {
  channel?: Channel,
  admins: Blob[],
};

type Registering = {
  challenge?: string,
  admins: Admin[],
};
type RegisteringSO = {
  challenge?: string,
  sharedOwners: Admin[],
};

type AdminApproval = Array<string>;

type Signin = {
  challenge?: Challenge,
  admins: Admin[],
};

export type Onboarding = {
  step: number,
  state: OnboardingState,
  wrapping: Wrapping,
  registering: Registering,
  registering_shared_owner: RegisteringSO,
  validating_shared_owner: {
    admins: AdminApproval,
    channels: Channel[],
  },
  quorum: ?number,
  signin: Signin,
  fatal_error: boolean,
  is_editable: boolean,
  provisionning: Provisionning,
  sharedOwners: Array<*>,
};

export type UIOnboarding = {
  device_modal: boolean,
  member_modal: boolean,
};

type Store = Onboarding & UIOnboarding;
type GetState = () => $Shape<{ onboarding: Store }>;

const initialState = {
  step: 0,
  device_modal: false,
  member_modal: false,
  quorum: 1,
  state: "LOADING",
  sharedOwners: [],
  wrapping: {
    blobs: [],
  },
  registering: {
    admins: [],
  },
  registering_shared_owner: {
    sharedOwners: [],
  },
  validating_shared_owner: {
    admins: [],
    channels: [],
  },
  signin: {
    admins: [],
  },
  fatal_error: false,
  is_editable: true,
  provisionning: {
    admins: [],
  },
};

export const getState: Function = () => async (dispatch: Dispatch<*>) => {
  const state = await network("/onboarding/state", "GET");
  dispatch({
    type: ONBOARDING_STATE,
    state,
  });
};

const handleError = (error: Object): Function => (dispatch: Dispatch<*>) => {
  if (error.json && error.json.name === "WRONG_ONBOARDING_STEP_EXCEPTION") {
    dispatch(getState());
  } else if (error.json && error.json.message) {
    dispatch(addMessage("Error", error.json.message, "error"));
  }
};

export const nextState = (data: any) => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  const onboarding_step = getState().onboarding.state;
  const dataToSend = data || {};
  dataToSend.current_step = onboarding_step;
  try {
    const next = await network("/onboarding/next", "POST", dataToSend);
    dispatch({
      type: NEXT_STEP,
      next,
    });
  } catch (e) {
    dispatch(handleError(e));
  }
};

export const previousState = (data: any) => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  const onboarding_step = getState().onboarding.state;
  const dataToSend = data || {};
  dataToSend.current_step = onboarding_step;
  try {
    const previous = await network("/onboarding/previous", "POST", dataToSend);
    dispatch({
      type: PREVIOUS_STEP,
      previous,
    });
  } catch (e) {
    dispatch(handleError(e));
  }
};

export const getChallenge = (onboarding_step: Object) =>
  network("/onboarding/challenge", "POST", onboarding_step);

export const authenticate = (data: any) =>
  network("/onboarding/authenticate", "POST", data);

export const addSharedOwner = (data: *) => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  try {
    const onboarding_step = getState().onboarding.state;
    const dataToSend = data || {};
    dataToSend.current_step = onboarding_step;
    const sharedOwners = await authenticate(dataToSend);
    dispatch({
      type: ONBOARDING_ADD_SHARED_OWNER,
      sharedOwners,
    });
  } catch (e) {
    dispatch(handleError(e));
  }
};

export const toggleDeviceModal = () => ({
  type: ONBOARDING_TOGGLE_DEVICE_MODAL,
});

export const toggleMemberModal = (member: any) => ({
  type: ONBOARDING_TOGGLE_MEMBER_MODAL,
  member,
});

export const openWrappingChannel = () => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  try {
    const onboarding_step = getState().onboarding.state;
    const dataToSend = {};
    dataToSend.current_step = onboarding_step;
    const wrapping: Wrapping = await getChallenge(dataToSend);
    dispatch({
      type: ONBOARDING_WRAPPING_CHANNEL,
      wrapping,
    });
  } catch (e) {
    dispatch(handleError(e));
    dispatch({
      type: ONBOARDING_FATAL_ERROR,
    });
  }
};

export const addWrappingKey = (data: Blob) => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  try {
    const onboarding_step = getState().onboarding.state;
    const dataToSend = { ...data, current_step: onboarding_step };
    const add_wrap: Wrapping = await authenticate(dataToSend);
    dispatch({
      type: ONBOARDING_ADD_WRAP_KEY,
      add_wrap,
    });
  } catch (e) {
    dispatch(handleError(e));
  }
};

export const getSharedOwnerRegistrationChallenge = () => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  try {
    const onboarding_step = getState().onboarding.state;
    const dataToSend = {};
    dataToSend.current_step = onboarding_step;
    const challenge = await getChallenge(dataToSend);
    dispatch({
      type: ONBOARDING_SHARED_OWNER_REGISTERING_CHALLENGE,
      challenge: challenge.challenge,
    });
  } catch (e) {
    dispatch(handleError(e));
    dispatch({
      type: ONBOARDING_FATAL_ERROR,
    });
  }
};
export const getRegistrationChallenge = () => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  try {
    const onboarding_step = getState().onboarding.state;
    const dataToSend = {};
    dataToSend.current_step = onboarding_step;
    const challenge = await getChallenge(dataToSend);
    dispatch({
      type: ONBOARDING_REGISTERING_CHALLENGE,
      challenge: challenge.challenge,
    });
  } catch (e) {
    dispatch(handleError(e));
    dispatch({
      type: ONBOARDING_FATAL_ERROR,
    });
  }
};

export const addMember = (data: Admin) => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  const { registering } = getState().onboarding;
  const admins = registering.admins;
  const findIndex = admins.findIndex(
    member => member.public_key === data.public_key,
  );
  if (findIndex > -1) {
    dispatch(addMessage("Error", "Device already registered", "error"));
    throw new Error("Already registered");
  } else {
    try {
      const admins = await network("/onboarding/authenticate", "POST", data);
      dispatch({
        type: ONBOARDING_ADD_ADMIN,
        admins,
      });
    } catch (e) {
      dispatch(handleError(e));
    }
  }
};

export const changeQuorum = (nb: number) => ({
  type: ONBOARDING_CHANGE_QUORUM,
  nb,
});

export const getSigninChallenge = () => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  const onboarding_step = getState().onboarding.state;
  const dataToSend = {};
  dataToSend.current_step = onboarding_step;
  const challenge = await getChallenge(dataToSend);
  dispatch({
    type: ONBOARDING_SIGNIN_CHALLENGE,
    challenge,
  });
};

export const addSignedIn = (pub_key: string, signature: *) => async (
  dispatch: Dispatch<*>,
  getState: Function,
) => {
  const { signin } = getState().onboarding;
  const admins = signin.admins;
  const index = admins.findIndex(pkey => pkey === pub_key.toUpperCase());

  if (index > -1) {
    return dispatch(
      addMessage(
        "Error",
        "This device has already been authenticated",
        "error",
      ),
    );
  }
  const data = {
    pub_key: pub_key.toUpperCase(),
    authentication: signature.rawResponse,
    current_step: getState().onboarding.state,
  };
  const to_dispatch = {
    pub_key: pub_key.toUpperCase(),
    authentication: signature.rawResponse,
  };

  await network("/onboarding/authenticate", "POST", data);
  // delete data['current_step']
  dispatch({
    type: ONBOARDING_ADD_SIGNEDIN,
    data: to_dispatch,
  });
};

export const addAdminValidation = (pub_key: string, signature: *) => async (
  dispatch: Dispatch<*>,
) => {
  try {
    const data = {
      public_key: pub_key.toUpperCase(),
      signature,
    };
    const admins = await network("/onboarding/authenticate", "POST", data);
    dispatch({
      type: ONBOARDING_ADD_ADMIN_VALIDATION,
      admins,
    });
  } catch (e) {
    dispatch(handleError(e));
  }
};

export const openAdminValidationChannel = () => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  const onboarding_step = getState().onboarding.state;
  const dataToSend = {};
  dataToSend.current_step = onboarding_step;
  const channels: * = await getChallenge(dataToSend);
  dispatch({
    type: ONBOARDING_ADMIN_VALIDATION_CHANNEL,
    channels,
  });
};

export const openProvisionningChannel = () => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  const onboarding_step = getState().onboarding.state;
  const dataToSend = {};
  dataToSend.current_step = onboarding_step;
  const channels: Wrapping = await getChallenge(dataToSend);
  dispatch({
    type: ONBOARDING_MASTERSEED_CHANNEL,
    channels,
  });
};

export const addMasterSeedKey = (data: Blob) => async (
  dispatch: Dispatch<*>,
  getState: GetState,
) => {
  try {
    const onboarding_step = getState().onboarding.state;
    const dataToSend = { ...data, current_step: onboarding_step };
    const add_seed = await authenticate(dataToSend);
    dispatch({
      type: ONBOARDING_ADD_MASTERSEED_KEY,
      add_seed,
    });
  } catch (e) {
    dispatch(handleError(e));
  }
};

export const wipe = () => async (dispatch: Dispatch<*>) => {
  await network("/onboarding/ongoing", "DELETE", {});
  const state = await network("/onboarding/state", "GET");
  dispatch({
    type: ONBOARDING_STATE,
    state,
  });
};

const syncNextState = (state: Store, action, next = false) => {
  let actionState = action.state;
  if (next) {
    actionState = action.next || action.previous;
  }
  let newState = { ...state, state: actionState.state, step: 0 };
  if (actionState.state === "WRAPPING_KEY_SIGN_IN") {
    newState = {
      ...state,
      state: "WRAPPING_KEY_SIGN_IN",
      step: 0,
      wrapping: {
        ...state.wrapping,
        channel: {
          ephemeral_public_key: actionState.ephemeral_public_key,
          ephemeral_certificate: actionState.ephemeral_certificate,
        },
        blobs: actionState.admins_devices,
      },
    };
  }
  if (actionState.state === "SHARED_OWNER_REGISTRATION") {
    const challenge = actionState.challenge
      ? actionState.challenge.challenge
      : null;
    newState = {
      ...state,
      state: actionState.state,
      registering_shared_owner: {
        ...state.registering_shared_owner,
        sharedOwners: actionState.shared_owners,
        challenge,
      },
    };
  }
  if (actionState.state === "ADMINISTRATORS_REGISTRATION") {
    const challenge = actionState.challenge
      ? actionState.challenge.challenge
      : null;
    newState = {
      ...state,
      state: actionState.state,
      registering: {
        ...state.registering,
        admins: actionState.admins,
        challenge,
      },
    };
  }

  if (actionState.state === "ADMINISTRATORS_SCHEME_CONFIGURATION") {
    newState = {
      ...state,
      state: actionState.state,
      registering: {
        ...state.registering,
        admins: actionState.admins,
      },
      quorum: actionState.quorum,
    };
  }
  if (actionState.state === "SHARED_OWNER_VALIDATION") {
    newState = {
      ...state,
      state: "SHARED_OWNER_VALIDATION",
      quorum: actionState.quorum,
      registering: {
        ...state.registering,
        admins: actionState.admins || [],
      },
      validating_shared_owner: {
        ...state.validating_shared_owner,
        channels: actionState.challenge || [],
        admins: actionState.admin_devices || actionState.admin_signatures,
      },
    };
  }
  if (actionState.state === "MASTER_SEED_GENERATION") {
    newState = {
      ...state,
      state: actionState.state,
      provisionning: {
        ...state.provisionning,
        channel: actionState.challenge || [],
        blobs: actionState.shared_owner_devices,
      },
    };
  }
  if (actionState.state === "COMPLETE") {
    newState = {
      ...state,
      state: actionState.state,
      quorum: actionState.quorum,
      registering: {
        ...state.registering,
        admins: actionState.admins,
      },
    };
  }

  return { ...newState, is_editable: actionState.is_editable };
};

export default function reducer(state: Store = initialState, action: Object) {
  switch (action.type) {
    case ONBOARDING_WRAPPING_CHANNEL:
      return {
        ...state,
        step: 0,
        wrapping: {
          ...state.wrapping,
          channel: action.wrapping,
        },
      };
    case ONBOARDING_FATAL_ERROR:
      return {
        ...state,
        fatal_error: true,
      };
    case ONBOARDING_ADD_WRAP_KEY: {
      return {
        ...state,
        wrapping: {
          ...state.wrapping,
          blobs: action.add_wrap,
        },
      };
    }
    case ONBOARDING_REGISTERING_CHALLENGE:
      return {
        ...state,
        step: 0,
        registering: {
          ...state.registering,
          challenge: action.challenge,
        },
      };
    case ONBOARDING_SHARED_OWNER_REGISTERING_CHALLENGE:
      return {
        ...state,
        step: 0,
        registering_shared_owner: {
          ...state.registering_shared_owner,
          challenge: action.challenge,
        },
      };
    case ONBOARDING_TOGGLE_DEVICE_MODAL:
      return { ...state, device_modal: !state.device_modal };
    case ONBOARDING_ADD_SHARED_OWNER: {
      return {
        ...state,
        registering_shared_owner: {
          ...state.registering_shared_owner,
          sharedOwners: action.sharedOwners,
        },
      };
    }
    case ONBOARDING_ADD_ADMIN:
      return {
        ...state,
        registering: {
          ...state.registering,
          admins: action.admins,
        },
      };
    case ONBOARDING_TOGGLE_MEMBER_MODAL:
      return {
        ...state,
        member_modal: !state.member_modal,
      };
    case ONBOARDING_CHANGE_QUORUM:
      if (action.nb > 0 && action.nb <= state.registering.admins.length) {
        return {
          ...state,
          quorum: action.nb,
        };
      }
      return state;
    case ONBOARDING_SIGNIN_CHALLENGE:
      return {
        ...state,
        step: 0,
        signin: { ...state.signin, challenge: action.challenge },
      };
    case ONBOARDING_ADD_ADMIN_VALIDATION:
      return {
        ...state,
        validating_shared_owner: {
          ...state.validating_shared_owner,
          admins: action.admins,
        },
      };
    case ONBOARDING_ADD_SIGNEDIN: {
      return {
        ...state,
        signin: {
          ...state.signin,
          admins: [...state.signin.admins, action.data.pub_key.toUpperCase()],
        },
      };
    }
    case ONBOARDING_ADMIN_VALIDATION_CHANNEL:
      return {
        ...state,
        step: 0,
        validating_shared_owner: {
          ...state.validating_shared_owner,
          channels: action.channels,
        },
      };
    case ONBOARDING_MASTERSEED_CHANNEL:
      return {
        ...state,
        step: 0,
        provisionning: {
          ...state.provisionning,
          channel: action.channels,
        },
      };
    case ONBOARDING_ADD_MASTERSEED_KEY:
      return {
        ...state,
        provisionning: {
          ...state.provisionning,
          blobs: action.add_seed,
        },
      };
    case ONBOARDING_STATE:
      return syncNextState(state, action);
    case PREVIOUS_STEP:
    case NEXT_STEP:
      if (action.next || action.previous) {
        return syncNextState(state, action, true);
      }
      return { ...state, step: state.step + 1 };
    default:
      return state;
  }
}
