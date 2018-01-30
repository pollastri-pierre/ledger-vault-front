//@flow
import { type Member } from "data/types";
import network from "network";

export const VIEW_ROUTE = "onboarding/VIEW_ROUTE";
export const SET_ONBOARDING_STATUS = "onboarding/SET_ONBOARDING_STATUS";
export const ADD_MEMBER = "onboarding/ADD_MEMBER";
export const GO_TO_NEXT = "onboarding/GO_TO_NEXT";
export const NEXT_STEP = "onboarding/NEXT_STEP";
export const PREV_STEP = "onboarding/PREV_STEP";
export const GO_TO_STEP = "onboarding/GO_TO_STEP";
export const CHANGE_NB_REQUIRED = "onboarding/CHANGE_NB_REQUIRED";
export const TOGGLE_MODAL_PROFILE = "onboarding/TOGGLE_MODAL_PROFILE";
export const GOT_CHALLENGE_REGISTRATION =
  "onboarding/GOT_CHALLENGE_REGISTRATION";
export const GOT_BOOTSTRAP_CHALLENGE = "onboarding/GOT_BOOTSTRAP_CHALLENGE";
export const GOT_BOOTSTRAP_TOKEN = "onboarding/GOT_BOOTSTRAP_TOKEN";
export const GOT_COMMIT_CHALLENGE = "onboarding/GOT_COMMIT_CHALLENGE";
export const COMMIT_ADMINISTRATORS = "onboarding/COMMIT_ADMINISTRATORS";
export const GOT_SHARD_CHALLENGE = "onboarding/GOT_SHARD_CHALLENGE";
export const GOT_SHARDS_CHANNEL = "onboarding/GOT_SHARD_CHANNEL";
export const TOGGLE_SIGNIN = "onboarding/TOGGLE_SIGNIN";
export const TOGGLE_GENERATE_SEED = "onboarding/TOGGLE_GENERATE_SEED";
export const ADD_SIGNEDIN = "onboarding/ADD_SIGNEDIN";
export const ADD_SEED_SHARD = "onboarding/ADD_SEED_SHARD";
export const SUCCESS_SEED_SHARDS = "onboarding/SUCCESS_SEED_SHARDS";
export const EDIT_MEMBER = "onboarding/EDIT_MEMBER";

type Challenge = string;
type Channel = string;

type OnboardingStatus = 0 | 1 | 2;

const ALL_ROUTES = [
  { label: "welcome", visited: true, milestone: true },
  { label: "authentication", visited: false, milestone: true },
  { label: "administrators_prerequisite", visited: false },
  { label: "administrators_configuration", visited: false },
  { label: "administrators_registration", visited: false },
  { label: "administrators_scheme", visited: false },
  { label: "administrators_confirmation", visited: false },
  { label: "seed_signin", visited: false },
  { label: "seed_prerequisite", visited: false },
  { label: "seed_configuration", visited: false },
  { label: "seed_backup", visited: false },
  { label: "seed_provisioning", visited: false },
  { label: "seed_confirmation", visited: false }
];

export type Store = {
  nbRequired: number,
  members: Array<Member>,
  currentStep: number,
  modalProfile: boolean,
  isLoadingChallengeRegistration: boolean,
  challenge_registration: ?string,
  bootstrapAuthToken: ?string,
  bootstrapChallenge: ?string,
  commit_challenge: ?string,
  editMember: ?Member,
  bootstrapId: *,
  committed_administrators: boolean,
  signed: Array<*>,
  steps: Array<*>,
  shardChallenge: ?string,
  signInModal: boolean,
  generateSeedModal: boolean,
  shards_channel: ?string,
  shards: Array<*>
};
const initialState: Store = {
  nbRequired: 3,
  members: [],
  steps: [{ label: "welcome", visited: true }],
  currentStep: 0,
  modalProfile: false,
  isLoadingChallengeRegistration: true,
  challenge_registration: null,
  bootstrapAuthToken: null,
  bootstrapChallenge: null,
  bootstrapId: null,
  commit_challenge: null,
  editMember: null,
  committed_administrators: false,
  signed: [],
  shardChallenge: null,
  signInModal: false,
  generateSeedModal: false,
  shards_channel: null,
  shards: []
};

export function goToStep(step_label: string) {
  return {
    type: GO_TO_STEP,
    step: step_label
  };
}

export function gotShardsChannel(shards_channel: Channel) {
  return {
    type: GOT_SHARDS_CHANNEL,
    shards_channel
  };
}

export function editMember(member: Member) {
  return {
    type: EDIT_MEMBER,
    member
  };
}

export function nextStep() {
  return {
    type: NEXT_STEP
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

export function addSeedShard(data: *) {
  return {
    type: ADD_SEED_SHARD,
    data
  };
}
export function addSignedIn(data: *) {
  return (dispatch: Function, getState: Function) => {
    dispatch({
      type: ADD_SIGNEDIN,
      data
    });

    const { signed, members } = getState()["onboarding"];

    if (signed.length === members.length) {
      return dispatch(openShardsChannel(signed));
    }
  };
}

export function provisioningShards(data: *) {
  return async (dispatch: Function) => {
    dispatch(nextStep());
    await network("/provisioning/seed/shards", "POST", data);
    return dispatch({
      type: SUCCESS_SEED_SHARDS
    });
  };
}

export function openShardsChannel(signed: Array<*>) {
  return async (dispatch: Function) => {
    const { shards_channel } = await network(
      "/provisioning/seed/open_shards_channel",
      "POST",
      signed
    );
    return dispatch(gotShardsChannel(shards_channel));
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

export function gotCommitChallenge(challenge: string) {
  return {
    type: GOT_COMMIT_CHALLENGE,
    challenge
  };
}

export function gotShardChallenge(challenge: Challenge) {
  return {
    type: GOT_SHARD_CHALLENGE,
    challenge
  };
}

export function commitAdministrators(data: *) {
  return async (dispatch: Function) => {
    await network("/provisioning/administrators/commit", "POST", data);
    return dispatch({ type: COMMIT_ADMINISTRATORS });
  };
}

export function signedMember() {}
export function getCommitChallenge() {
  return async (dispatch: Function) => {
    const { challenge } = await network(
      "/provisioning/administrators/commit_challenge",
      "GET"
    );

    return dispatch(gotCommitChallenge(challenge));
  };
}

export function gotChallengeRegistation(challenge: Challenge) {
  return {
    type: GOT_CHALLENGE_REGISTRATION,
    challenge
  };
}

export function gotBootstrapToken(token: string) {
  return (dispatch: Function) => {
    window.localStorage.setItem("token", token);
    dispatch({
      type: GOT_BOOTSTRAP_TOKEN,
      token
    });
  };
}

export function getBootstrapToken(pub_key: string, authentication: string) {
  return async (dispatch: Function, getState: () => Object) => {
    const { bootstrapId } = getState()["onboarding"];
    const data = {
      id: bootstrapId,
      authentication: authentication,
      pub_key: pub_key
    };
    const { token } = await network("/authenticate", "POST", data);
    return dispatch(gotBootstrapToken(token));
  };
}

export function getShardChallenge() {
  return async (dispatch: Function) => {
    const { challenge } = await network(
      "/provisioning/seed/shards_channel_challenge",
      "GET"
    );
    return dispatch(gotShardChallenge(challenge));
  };
}

export function getBootstrapChallenge() {
  return async (dispatch: Function) => {
    const { challenge, id } = await network("/authentication_challenge", "GET");
    return dispatch(gotBootstrapChallenge(atob(challenge), id));
  };
}

export function gotBootstrapChallenge(challenge: string, requestId: string) {
  return {
    type: GOT_BOOTSTRAP_CHALLENGE,
    challenge,
    requestId
  };
}

export function getChallengeRegistration() {
  return async (dispatch: Function) => {
    const { challenge } = await network(
      "/provisioning/administrators/register",
      "GET"
    );
    return dispatch(gotChallengeRegistation(challenge));
  };
}

export function setOnboardingStatus(status: OnboardingStatus) {
  return {
    type: SET_ONBOARDING_STATUS,
    status: status
  };
}

export function addMember(member: Member) {
  return {
    type: ADD_MEMBER,
    member: member
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

export default function reducer(state: Store = initialState, action: Object) {
  switch (action.type) {
    case SET_ONBOARDING_STATUS: {
      return { ...state, status: action.status };
    }
    case ADD_MEMBER: {
      return { ...state, members: [...state.members, action.member] };
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
      if (state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;
    }
    case NEXT_STEP: {
      if (state.currentStep < ALL_ROUTES.length - 1) {
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
    case GOT_BOOTSTRAP_CHALLENGE: {
      return {
        ...state,
        bootstrapChallenge: action.challenge,
        bootstrapId: action.requestId
      };
    }
    case GOT_BOOTSTRAP_TOKEN: {
      return {
        ...state,
        bootstrapAuthToken: action.token
      };
    }
    case GOT_CHALLENGE_REGISTRATION: {
      return {
        ...state,
        challenge_registration: action.challenge,
        isLoadingChallengeRegistration: false
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
    case COMMIT_ADMINISTRATORS: {
      return {
        ...state,
        committed_administrators: true
      };
    }
    case ADD_SIGNEDIN: {
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
    case EDIT_MEMBER: {
      console.log(action);
      const index = state.members.findIndex(
        member => member.public_key === action.member.public_key
      );
      if (index > -1) {
        //
      }
      return state;
    }
    case SUCCESS_SEED_SHARDS: {
      return {
        ...state,
        successSeedShards: true
      };
    }
    default:
      return state;
  }
}
