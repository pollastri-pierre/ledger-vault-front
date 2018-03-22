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
export const LOCK_PARTITION = "onboarding/LOCK_PARTITION";
export const REGISTER_KEYHANDLE = "onboarding/REGISTER_KEYHANDLE";

type Challenge = {
  challenge: string,
  handles: string[],
  id: string
};

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
  bootstrapChallenge: ?Challenge,
  commit_challenge: ?string,
  editMember: ?Member,
  committed_administrators: boolean,
  signed: Array<*>,
  steps: Array<*>,
  shardChallenge: ?string,
  signInModal: boolean,
  generateSeedModal: boolean,
  shards_channel: ?string,
  shards: Array<*>,
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
  bootstrapAuthToken: null,
  bootstrapChallenge: null,
  commit_challenge: null,
  editMember: null,
  committed_administrators: false,
  signed: [],
  shardChallenge: null,
  signInModal: false,
  generateSeedModal: false,
  shards_channel: null,
  shards: [],
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

export function setAdminScheme() {
  return async (dispatch: Function, getState: () => Object) => {
    const { nbRequired } = getState()["onboarding"];
    return await network("/hsm/admins/commit", "POST", {
      quorum: parseInt(nbRequired, 10)
    });
  };
}

export function gotShardsChannel(shards_channel: Channel) {
  return {
    type: GOT_SHARDS_CHANNEL,
    shards_channel
  };
}

export function getShardsChannel() {
  return async dispatch => {
    const shards = await network("/hsm/partition/provisioning/start", "POST", {
      count_shards: 3
    });

    dispatch(gotShardsChannel(shards));
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

export function addSignedIn(pub_key: string, signature: *) {
  return async (dispatch: Function) => {
    const data = {
      pub_key: pub_key.toUpperCase(),
      authentication: signature.rawResponse
    };

    await network("/hsm/authentication/bootstrap/authenticate", "POST", data);
    dispatch({
      type: ADD_SIGNEDIN,
      data
    });
  };
}

export function provisioningShards() {
  return async (dispatch: Function, getState: Function) => {
    const { shards } = getState()["onboarding"];
    dispatch(nextStep());
    await network("/hsm/partition/provisioning/commit", "POST", {
      fragments: shards
    });
    return dispatch({
      type: SUCCESS_SEED_SHARDS
    });
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

export function signedMember() {}
export function getCommitChallenge() {
  return async (dispatch: Function) => {
    const challenge = await network(
      "/hsm/confirmation/partition/challenge",
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

export function gotBootstrapToken(result: *) {
  return (dispatch: Function) => {
    dispatch({
      type: GOT_BOOTSTRAP_TOKEN,
      result
    });
  };
}

export function getBootstrapToken(pub_key: string, signature: string) {
  return async (dispatch: Function => Object) => {
    const data = {
      pub_key: pub_key.toUpperCase(),
      authentication: signature.rawResponse
    };
    const result = await network(
      "/hsm/authentication/bootstrap/authenticate",
      "POST",
      data
    );
    return dispatch(gotBootstrapToken(result));
  };
}

export function lockPartition() {
  return {
    type: LOCK_PARTITION
  };
}

export function commitAdministrators(pub_key: string, signature: string) {
  return async (dispatch: Function => Object) => {
    const data = {
      pub_key: pub_key.toUpperCase(),
      authentication: signature.rawResponse
    };
    await network("/hsm/authentication/bootstrap/authenticate", "POST", data);
    await network("/hsm/partition/lock", "POST");
    return dispatch(lockPartition());
  };
}

export function getShardChallenge() {
  return async (dispatch: Function) => {
    const challenge = await network(
      "/hsm/session/admin/partition/challenge",
      "GET"
    );
    return dispatch(gotShardChallenge(challenge));
  };
}

export function getBootstrapChallenge() {
  return async (dispatch: Function) => {
    const challengeObject = await network(
      "/hsm/authentication/bootstrap/challenge",
      "GET"
    );
    return dispatch(gotBootstrapChallenge(challengeObject));
  };
}

export function gotBootstrapChallenge(challenge: Challenge) {
  return {
    type: GOT_BOOTSTRAP_CHALLENGE,
    challenge
  };
}

export function getChallengeRegistration() {
  return async (dispatch: Function) => {
    const { challenge } = await network(
      "/hsm/admins/register/challenge",
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
        bootstrapChallenge: action.challenge
      };
    }
    case GOT_BOOTSTRAP_TOKEN: {
      return {
        ...state,
        bootstrapAuthToken: action.result
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
    case COMMIT_ADMINISTRATORS: {
      return {
        ...state,
        committed_administrators: true
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
    case EDIT_MEMBER: {
      const index = state.members.findIndex(
        member => member.pub_key === action.member.pub_key
      );

      if (index > -1) {
        const newMembers = state.members.map((item, i) => {
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
    default:
      return state;
  }
}
