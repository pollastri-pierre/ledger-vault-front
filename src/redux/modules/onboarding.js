//@flow
import { type Member } from "data/types";
import { addMessage } from "redux/modules/alerts";
import type { Dispatch } from "redux";
import network from "network";
export const SET_CURRENT_STEP = "onboarding/SET_CURRENT_STEP";
export const VIEW_ROUTE = "onboarding/VIEW_ROUTE";
export const ADD_MEMBER = "onboarding/ADD_MEMBER";
export const GO_TO_NEXT = "onboarding/GO_TO_NEXT";
export const NEXT_STEP = "onboarding/NEXT_STEP";
export const PREV_STEP = "onboarding/PREV_STEP";
export const GO_TO_STEP = "onboarding/GO_TO_STEP";
export const CHANGE_NB_REQUIRED = "onboarding/CHANGE_NB_REQUIRED";
export const TOGGLE_MODAL_PROFILE = "onboarding/TOGGLE_MODAL_PROFILE";
export const GOT_CHALLENGE_REGISTRATION =
  "onboarding/GOT_CHALLENGE_REGISTRATION";
export const GOT_COMMIT_CHALLENGE = "onboarding/GOT_COMMIT_CHALLENGE";
export const GOT_SHARD_CHALLENGE = "onboarding/GOT_SHARD_CHALLENGE";
export const GOT_SHARDS_CHANNEL = "onboarding/GOT_SHARD_CHANNEL";
export const GOT_WRAPS_CHANNEL = "onboarding/GOT_WRAPS_CHANNEL";
export const TOGGLE_SIGNIN = "onboarding/TOGGLE_SIGNIN";
export const TOGGLE_GENERATE_SEED = "onboarding/TOGGLE_GENERATE_SEED";
export const ADD_SIGNEDIN = "onboarding/ADD_SIGNEDIN";
export const ADD_SEED_SHARD = "onboarding/ADD_SEED_SHARD";
export const ADD_WRAP_SHARD = "onboarding/ADD_WRAP_SHARD";
export const SUCCESS_SEED_SHARDS = "onboarding/SUCCESS_SEED_SHARDS";
export const EDIT_MEMBER = "onboarding/EDIT_MEMBER";
export const LOCK_PARTITION = "onboarding/LOCK_PARTITION";
export const REGISTER_KEYHANDLE = "onboarding/REGISTER_KEYHANDLE";

type Challenge = {
  challenge: string,
  handles: string[],
  id: string
};

type Channel = string;

const ALL_ROUTES = [
  { label: "welcome", visited: true, milestone: true, step: 1 },
  { label: "authentication", visited: false, milestone: true, step: 2 },
  { label: "administrators_prerequisite", visited: false, step: 3 },
  { label: "administrators_configuration", visited: false, step: 3 },
  { label: "administrators_registration", visited: false, step: 3 },
  { label: "administrators_scheme", visited: false, step: 3 },
  { label: "seed_signin", visited: false, step: 5 },
  { label: "seed_prerequisite", visited: false, step: 6 },
  { label: "seed_configuration", visited: false, step: 6 },
  { label: "seed_backup", visited: false, step: 6 },
  { label: "seed_provisioning", visited: false, step: 6 },
  { label: "seed_confirmation", visited: false, step: 6 }
];

export type Store = {
  nbRequired: number,
  members: Array<Member>,
  currentStep: ?number,
  modalProfile: boolean,
  isLoadingChallengeRegistration: boolean,
  challenge_registration: ?string,
  editMember: ?Member,
  signed: Array<*>,
  steps: Array<*>,
  shardChallenge: ?string,
  signInModal: boolean,
  generateSeedModal: boolean,
  shards_channel: ?string,
  wraps_channel: ?string,
  shards: Array<*>,
  wraps: Array<*>,
  partition_locked: boolean,
  key_handles: Object
};

const initialState: Store = {
  nbRequired: 3,
  members: [],
  steps: [{ label: "welcome", visited: true }],
  currentStep: 0,
  modalProfile: false,
  isLoadingChallengeRegistration: true,
  challenge_registration: null,
  editMember: null,
  signed: [],
  shardChallenge: null,
  signInModal: false,
  generateSeedModal: false,
  shards_channel: null,
  wraps_channel: null,
  shards: [],
  wraps: [],
  partition_locked: false,
  key_handles: {}
};

export function goToStep(step_label: string) {
  return {
    type: GO_TO_STEP,
    step: step_label
  };
}

export function registerKeyHandle(pubKey: string, keyHandle: string) {
  return {
    type: REGISTER_KEYHANDLE,
    pubKey,
    keyHandle
  };
}

export function gotShardsChannel(shards_channel: Channel) {
  return {
    type: GOT_SHARDS_CHANNEL,
    shards_channel
  };
}

export function gotWrapsChannel(wraps_channel: Channel) {
  return {
    type: GOT_WRAPS_CHANNEL,
    wraps_channel
  };
}

export function getShardsChannel() {
  return async (dispatch: Function) => {
    const shards = await network("/onboarding/challenge", "GET");

    dispatch(gotShardsChannel(shards));
  };
}

export function getWrapsChannel() {
  return async (dispatch: Function) => {
    const wraps = await network("/onboarding/challenge", "GET");

    dispatch(gotWrapsChannel(wraps));
  };
}

export function editMember(member: Member) {
  return async (dispatch: Function) => {
    return await network(
      "/provisioning/administrators/register",
      "PUT",
      member
    ).then(() => {
      dispatch({
        type: EDIT_MEMBER,
        member
      });
    });
  };
}

export function nextStep() {
  return {
    type: NEXT_STEP
  };
}

export function nextState(data: *) {
  return async (dispatch: Dispatch<*>) => {
    const dataToSend = data || {};
    await network("/onboarding/next", "POST", dataToSend);
    dispatch(nextStep());
  };
}
export function toggleSignin() {
  return {
    type: TOGGLE_SIGNIN
  };
}

export function toggleGenerateSeed() {
  return {
    type: TOGGLE_GENERATE_SEED
  };
}

export function addWrapShard(data: *) {
  return async (dispatch: Dispatch<*>) => {
    await network("/onboarding/authenticate", "POST", data);
    return dispatch({
      type: ADD_WRAP_SHARD,
      data
    });
  };
}

export function addSeedShard(data: *) {
  return async (dispatch: Dispatch<*>) => {
    await network("/onboarding/authenticate", "POST", data);
    return dispatch({
      type: ADD_SEED_SHARD,
      data
    });
  };
}

export function addSignedIn(pub_key: string, signature: *) {
  return async (dispatch: Dispatch<*>, getState: Function) => {
    const { signed } = getState()["onboarding"];
    const index = signed.findIndex(
      member => member.pub_key === pub_key.toUpperCase()
    );

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
        type: ADD_SIGNEDIN,
        data
      });
    }
  };
}

export function toggleModalProfile(member: Member) {
  return {
    type: TOGGLE_MODAL_PROFILE,
    member
  };
}

export function previousStep() {
  return {
    type: PREV_STEP
  };
}

export function gotShardChallenge(challenge: Challenge) {
  return {
    type: GOT_SHARD_CHALLENGE,
    challenge
  };
}

export function gotChallengeRegistation(challenge: Challenge) {
  return {
    type: GOT_CHALLENGE_REGISTRATION,
    challenge
  };
}

export function lockPartition() {
  return {
    type: LOCK_PARTITION
  };
}

export function getShardChallenge() {
  return async (dispatch: Dispatch<*>) => {
    const challenge = await network("/onboarding/challenge", "GET");
    return dispatch(gotShardChallenge(challenge));
  };
}

export function getChallengeRegistration() {
  return async (dispatch: Dispatch<*>) => {
    const { challenge } = await network("/onboarding/challenge", "GET");
    return dispatch(gotChallengeRegistation(challenge));
  };
}

export function changeNbRequired(nb: number) {
  return {
    type: CHANGE_NB_REQUIRED,
    nb
  };
}

export function viewRoute(currentRoute: string) {
  return {
    type: VIEW_ROUTE,
    route: currentRoute
  };
}

export function getCurrentState() {
  return async (dispatch: Dispatch<*>) => {
    const { step } = await network("/onboarding/state", "GET");
    return dispatch({
      type: SET_CURRENT_STEP,
      step
    });
  };
}

export function addMember(data: Member) {
  return async (dispatch: Dispatch<*>, getState: Function) => {
    const { members } = getState()["onboarding"];
    const findIndex = members.findIndex(
      member => member.pub_key === data.pub_key
    );
    if (findIndex > -1) {
      dispatch(addMessage("Error", "Device already registered", "error"));
      throw "Already registered";
    } else {
      await network("/onboarding/authenticate", "POST", data);
      dispatch({
        type: ADD_MEMBER,
        member: data
      });
    }
  };
}

export default function reducer(state: Store = initialState, action: Object) {
  switch (action.type) {
    case ADD_MEMBER: {
      return {
        ...state,
        members: [...state.members, action.member],
        key_handles: {
          ...state.key_handles,
          ...{ [action.member.pub_key]: action.member.key_handle }
        }
      };
    }
    case CHANGE_NB_REQUIRED: {
      if (action.nb > 0 && action.nb <= state.members.length) {
        return {
          ...state,
          nbRequired: action.nb
        };
      }
      return state;
    }
    case PREV_STEP: {
      if (state.currentStep && state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;
    }
    case NEXT_STEP: {
      if (
        typeof state.currentStep !== "undefined" &&
        state.currentStep < ALL_ROUTES.length - 1
      ) {
        return { ...state, currentStep: state.currentStep + 1 };
      }
      return state;
    }
    case GO_TO_STEP: {
      return {
        ...state,
        currentStep: action.step,
        steps: [...state.steps, action.step]
      };
    }
    case TOGGLE_SIGNIN: {
      return {
        ...state,
        signInModal: !state.signInModal
      };
    }
    case TOGGLE_MODAL_PROFILE: {
      return {
        ...state,
        modalProfile: !state.modalProfile,
        editMember: action.member
      };
    }
    case TOGGLE_GENERATE_SEED: {
      return {
        ...state,
        generateSeedModal: !state.generateSeedModal
      };
    }
    case GOT_CHALLENGE_REGISTRATION: {
      return {
        ...state,
        challenge_registration: action.challenge,
        isLoadingChallengeRegistration: false
      };
    }
    case REGISTER_KEYHANDLE: {
      return {
        ...state,
        key_handles: {
          ...state.key_handles,
          ...{ [action.pubKey]: action.keyHandle }
        }
      };
    }
    case GOT_SHARD_CHALLENGE: {
      return {
        ...state,
        shardChallenge: action.challenge
      };
    }
    case GOT_COMMIT_CHALLENGE: {
      return {
        ...state,
        commit_challenge: action.challenge
      };
    }
    case GOT_SHARDS_CHANNEL: {
      return {
        ...state,
        shards_channel: action.shards_channel
      };
    }
    case GOT_WRAPS_CHANNEL: {
      return {
        ...state,
        wraps_channel: action.wraps_channel
      };
    }
    case ADD_SIGNEDIN: {
      const index = state.signed.findIndex(
        member => member.pub_key === action.data.pub_key
      );

      if (index > -1) {
        return state;
      }
      return {
        ...state,
        signed: [...state.signed, action.data]
      };
    }
    case ADD_SEED_SHARD: {
      return {
        ...state,
        shards: [...state.shards, action.data]
      };
    }
    case ADD_WRAP_SHARD: {
      return {
        ...state,
        wraps: [...state.wraps, action.data]
      };
    }
    case EDIT_MEMBER: {
      const index = state.members.findIndex(
        member => member.pub_key === action.member.pub_key
      );

      if (index > -1) {
        const newMembers: Array<Member> = state.members.map((item, i) => {
          if (i !== index) {
            return item;
          }

          return {
            ...item,
            ...action.member
          };
        });

        return { ...state, members: newMembers };
      }

      return state;
    }
    case LOCK_PARTITION: {
      return {
        ...state,
        partition_locked: true
      };
    }
    case SUCCESS_SEED_SHARDS: {
      return {
        ...state,
        successSeedShards: true
      };
    }
    case SET_CURRENT_STEP: {
      const step = ALL_ROUTES.findIndex(route => route.step === action.step);
      return {
        ...state,
        currentStep: step
      };
    }
    default:
      return state;
  }
}
