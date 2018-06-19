//@flow
import network from "network";
import { addMessage } from "redux/modules/alerts";

export const ONBOARDING_WRAPPING_CHANNEL = "ONBOARDING_WRAPPING_CHANNEL";
export const ONBOARDING_REGISTERING_CHALLENGE =
  "ONBOARDING_REGISTERING_CHALLENGE";
export const ONBOARDING_SIGNIN_CHALLENGE = "ONBOARDING_SIGNIN_CHALLENGE";
export const ONBOARDING_TOGGLE_DEVICE_MODAL = "ONBOARDING_TOGGLE_DEVICE_MODAL";
export const ONBOARDING_TOGGLE_MEMBER_MODAL = "ONBOARDING_TOGGLE_MEMBER_MODAL";
export const NEXT_STEP = "NEXT_STEP";
export const ONBOARDING_STATE = "ONBOARDING_STATE";
export const ONBOARDING_ADD_WRAP_KEY = "ONBOARDING_ADD_WRAP_KEY";
export const ONBOARDING_CHANGE_QUORUM = "ONBOARDING_CHANGE_QUORUM";
export const ONBOARDING_ADD_ADMIN = "ONBOARDING_ADD_ADMIN";
export const ONBOARDING_ADD_SIGNEDIN = "ONBOARDING_ADD_SIGNEDIN";
export const ONBOARDING_MASTERSEED_CHANNEL = "ONBOARDING_MASTERSEED_CHANNEL";
export const ONBOARDING_ADD_MASTERSEED_KEY = "ONBOARDING_ADD_MASTERSEED_KEY";

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
  | "ADMINISTRATORS_SIGN_IN"
  | "MASTER_SEED_PREREQUISITE"
  | "MASTER_SEED_CONFIGURATION"
  | "MASTER_SEED_BACKUP"
  | "MASTER_SEED_GENERATION"
  | "COMPLETE";

type KeyHandle = { [_: string]: string };

type Challenge = {
  challenge: string,
  key_handle?: KeyHandle
};

type Channel = {
  ephemeral_public_key: string,
  certificate: string
};

type Blob = {
  ephemeral_public_key: string,
  certificate: string,
  blob: string
};

type Admin = $Shape<{
  uid: string,
  pub_key: string,
  last_name: string,
  first_name: string,
  email: string,
  key_handle: string,
  validation: Object,
  u2f_register: Object
}>;

type Wrapping = {
  channel?: Channel,
  blobs: Blob[]
};
type Provisionning = {
  channel?: Channel,
  admins: Blob[]
};

type Registering = {
  challenge?: string,
  admins: Admin[]
};

type Signin = {
  challenge?: Challenge,
  admins: Admin[]
};

export type Onboarding = {
  step: number,
  state: OnboardingState,
  wrapping: Wrapping,
  registering: Registering,
  quorum: ?number,
  signin: Signin,
  provisionning: Provisionning
};

export type UIOnboarding = {
  device_modal: boolean,
  member_modal: boolean
};

type Store = Onboarding & UIOnboarding;

const initialState = {
  step: 0,
  device_modal: false,
  member_modal: false,
  quorum: 1,
  state: "LOADING",
  wrapping: {
    blobs: []
  },
  registering: {
    admins: []
  },
  signin: {
    admins: []
  },
  provisionning: {
    admins: []
  }
};

export const nextState = (data: any) => {
  return async (dispatch: Dispatch<*>) => {
    const dataToSend = data || {};
    const next = await network("/onboarding/next", "POST", dataToSend);
    dispatch({
      type: NEXT_STEP,
      next
    });
  };
};
export const getChallenge = () => {
  return network("/onboarding/challenge", "GET");
};

export const authenticate = (data: any) => {
  return network("/onboarding/authenticate", "POST", data);
};

export const toggleDeviceModal = () => ({
  type: ONBOARDING_TOGGLE_DEVICE_MODAL
});

export const toggleMemberModal = () => ({
  type: ONBOARDING_TOGGLE_MEMBER_MODAL
});

export const openWrappingChannel = () => {
  return async (dispatch: Dispatch<*>) => {
    const wrapping: Wrapping = await getChallenge();
    dispatch({
      type: ONBOARDING_WRAPPING_CHANNEL,
      wrapping
    });
  };
};

export const addWrappingKey = (data: Blob) => {
  return async (dispatch: Dispatch<*>) => {
    const add_wrap: Wrapping = await authenticate(data);
    dispatch({
      type: ONBOARDING_ADD_WRAP_KEY,
      add_wrap
    });
  };
};

export const getRegistrationChallenge = () => {
  return async (dispatch: Dispatch<*>) => {
    const challenge = await getChallenge();
    dispatch({
      type: ONBOARDING_REGISTERING_CHALLENGE,
      challenge: challenge.challenge
    });
  };
};

export const addMember = (data: Admin) => {
  return async (dispatch: Dispatch<*>, getState: Function) => {
    const { registering } = getState()["onboarding"];
    const admins = registering.admins;
    const findIndex = admins.findIndex(
      member => member.pub_key === data.pub_key
    );
    if (findIndex > -1) {
      dispatch(addMessage("Error", "Device already registered", "error"));
      throw "Already registered";
    } else {
      await network("/onboarding/authenticate", "POST", data);
      dispatch({
        type: ONBOARDING_ADD_ADMIN,
        admin: data
      });
    }
  };
};

export const changeQuorum = (nb: number) => {
  return {
    type: ONBOARDING_CHANGE_QUORUM,
    nb
  };
};

export const getSigninChallenge = () => {
  return async (dispatch: Dispatch<*>) => {
    const challenge = await getChallenge();
    dispatch({
      type: ONBOARDING_SIGNIN_CHALLENGE,
      challenge: challenge
    });
  };
};

export const addSignedIn = (pub_key: string, signature: *) => {
  return async (dispatch: Dispatch<*>, getState: Function) => {
    const { signin } = getState()["onboarding"];
    const admins = signin.admins;
    const index = admins.findIndex(pkey => pkey === pub_key.toUpperCase());

    if (index > -1) {
      return dispatch(
        addMessage(
          "Error",
          "This device has already been authenticated",
          "error"
        )
      );
    } else {
      const data = {
        pub_key: pub_key.toUpperCase(),
        authentication: signature.rawResponse
      };

      await network("/onboarding/authenticate", "POST", data);
      dispatch({
        type: ONBOARDING_ADD_SIGNEDIN,
        data
      });
    }
  };
};

export const openProvisionningChannel = () => {
  return async (dispatch: Dispatch<*>) => {
    const wrapping: Wrapping = await getChallenge();
    dispatch({
      type: ONBOARDING_MASTERSEED_CHANNEL,
      wrapping
    });
  };
};

export const addMasterSeedKey = (data: Blob) => {
  return async (dispatch: Dispatch<*>) => {
    const add_seed = await authenticate(data);
    dispatch({
      type: ONBOARDING_ADD_MASTERSEED_KEY,
      add_seed
    });
  };
};

export const getState = () => {
  return async (dispatch: Dispatch<*>) => {
    const state = await network("/onboarding/state", "GET");
    dispatch({
      type: ONBOARDING_STATE,
      state
    });
  };
};

const syncNextState = (state: Store, action, next = false) => {
  let actionState = action.state;
  if (next) {
    actionState = action.next;
  }
  if (actionState.state === "WRAPPING_KEY_SIGN_IN") {
    return {
      ...state,
      state: "WRAPPING_KEY_SIGN_IN",
      step: 0,
      wrapping: {
        ...state.wrapping,
        channel: {
          ephemeral_public_key: actionState.ephemeral_public_key,
          ephemeral_certificate: actionState.ephemeral_certificate
        },
        blobs: actionState.admins_devices
      }
    };
  }
  if (actionState.state === "ADMINISTRATORS_REGISTRATION") {
    const challenge = actionState.challenge
      ? actionState.challenge.challenge
      : null;
    return {
      ...state,
      state: actionState.state,
      registering: {
        ...state.registering,
        admins: actionState.admins,
        challenge: challenge
      }
    };
  }

  if (actionState.state === "ADMINISTRATORS_SCHEME_CONFIGURATION") {
    return {
      ...state,
      state: actionState.state,
      registering: {
        ...state.registering,
        admins: actionState.admins
      },
      quorum: actionState.quorum
    };
  }
  if (actionState.state === "ADMINISTRATORS_SIGN_IN") {
    return {
      ...state,
      state: actionState.state,
      registering: {
        ...state.registering,
        admins: actionState.admins
      },
      step: actionState.is_open ? 1 : 0,
      signin: {
        ...state.signin,
        admins: actionState.completed_keys || [],
        challenge: {
          ...state.signin.challenge,
          challenge: actionState.challenge,
          key_handle: actionState.key_handle
        }
      }
    };
  }
  if (actionState.state === "MASTER_SEED_GENERATION") {
    return {
      ...state,
      state: actionState.state,
      provisionning: {
        ...state.provisionning,
        channel: {
          ephemeral_public_key: actionState.ephemeral_public_key,
          ephemeral_certificate: actionState.ephemeral_certificate
        },
        blobs: actionState.admins_devices
      }
    };
  }
  if (actionState.state === "COMPLETE") {
    return {
      ...state,
      state: actionState.state,
      quorum: actionState.quorum,
      registering: {
        ...state.registering,
        admins: actionState.admins
      }
    };
  }
  return { ...state, state: actionState.state, step: 0 };
};

export default function reducer(state: Store = initialState, action: Object) {
  switch (action.type) {
    case ONBOARDING_WRAPPING_CHANNEL:
      return {
        ...state,
        step: 0,
        wrapping: {
          ...state.wrapping,
          channel: action.wrapping
        }
      };
    case ONBOARDING_ADD_WRAP_KEY: {
      return {
        ...state,
        wrapping: {
          ...state.wrapping,
          blobs: action.add_wrap
        }
      };
    }
    case ONBOARDING_REGISTERING_CHALLENGE:
      return {
        ...state,
        step: 0,
        registering: {
          ...state.registering,
          challenge: action.challenge
        }
      };
    case ONBOARDING_TOGGLE_DEVICE_MODAL:
      return { ...state, device_modal: !state.device_modal };
    case ONBOARDING_ADD_ADMIN:
      return {
        ...state,
        registering: {
          ...state.registering,
          admins: [...state.registering.admins, action.admin]
        }
      };
    case ONBOARDING_TOGGLE_MEMBER_MODAL:
      return { ...state, member_modal: !state.member_modal };
    case ONBOARDING_CHANGE_QUORUM:
      if (action.nb > 0 && action.nb <= state.registering.admins.length) {
        return {
          ...state,
          quorum: action.nb
        };
      }
      return state;
    case ONBOARDING_SIGNIN_CHALLENGE:
      return {
        ...state,
        step: 0,
        signin: { ...state.signin, challenge: action.challenge }
      };
    case ONBOARDING_ADD_SIGNEDIN: {
      return {
        ...state,
        signin: {
          ...state.signin,
          admins: [...state.signin.admins, action.data.pub_key.toUpperCase()]
        }
      };
    }
    case ONBOARDING_MASTERSEED_CHANNEL:
      return {
        ...state,
        step: 0,
        provisionning: {
          ...state.provisionning,
          channel: action.wrapping
        }
      };
    case ONBOARDING_ADD_MASTERSEED_KEY:
      return {
        ...state,
        provisionning: {
          ...state.provisionning,
          blobs: action.add_seed
        }
      };
    case ONBOARDING_STATE:
      return syncNextState(state, action);
    case NEXT_STEP:
      if (action.next) {
        return syncNextState(state, action, true);
      }
      return { ...state, step: state.step + 1 };
    default:
      return state;
  }
}
