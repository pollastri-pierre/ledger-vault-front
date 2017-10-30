import { LOGOUT } from "./auth";

export const GET_ORGANIZATION_MEMBERS_START =
  "organization/GET_ORGANIZATION_MEMBERS_START";
export const GOT_ORGANIZATION_MEMBERS = "organization/GOT_ORGANIZATION_MEMBERS";
export const GOT_ORGANIZATION_MEMBERS_FAIL =
  "organization/GOT_ORGANIZATION_MEMBERS_FAIL";
export const GET_ORGANIZATION_APPROVERS_START =
  "organization/GET_ORGANIZATION_APPROVERS_START";
export const GOT_ORGANIZATION_APPROVERS =
  "organization/GOT_ORGANIZATION_APPROVERS";
export const GOT_ORGANIZATION_APPROVERS_FAIL =
  "organization/GOT_ORGANIZATION_APPROVERS_FAIL";

const fakeApprovers = [
  {
    id: 2,
    pub_key: "ewfwekljfkujkljlkj",
    name: "McAndersen",
    firstname: "Julie",
    role: "Administrator",
    picture: "http://yoursocialcom.eu/wp-content/uploads/avatar-1.png"
  },
  {
    id: 1,
    pub_key: "fewrfsdiekjfkdsjk",
    name: "Smith",
    firstname: "Henrietta",
    role: "Administrator"
  },
  {
    id: 3,
    pub_key: "edoiooooooo",
    name: "Josh",
    firstname: "Emily",
    role: "Operator",
    picture:
      "http://www.marketaccessbd.com/wp-content/uploads/2014/08/avatar-8.png"
  }
];

const fakeMembers = [
  {
    id: 2,
    pub_key: "ewfwekljfkujkljlkj",
    name: "McAndersen",
    firstname: "Julie",
    role: "Administrator",
    picture: "http://yoursocialcom.eu/wp-content/uploads/avatar-1.png"
  },
  {
    id: 1,
    pub_key: "fewrfsdiekjfkdsjk",
    name: "Smith",
    firstname: "Henrietta",
    role: "Administrator"
  },
  {
    id: 3,
    pub_key: "edoiooooooo",
    name: "Josh",
    firstname: "Emily",
    role: "Operator",
    picture:
      "http://www.marketaccessbd.com/wp-content/uploads/2014/08/avatar-8.png"
  },
  {
    id: 4,
    pub_key: "eooeoqwfdksjkjl",
    name: "Galvok Jr",
    firstname: "Peder",
    role: "Operator"
  },
  {
    id: 5,
    pub_key: "wewoleoolele",
    name: "St Mamba",
    firstname: "Paul",
    role: "Operator"
  },
  {
    id: 6,
    pub_key: "fweiujekllcxoelk",
    name: "Teissier",
    firstname: "Florent",
    role: "Operator",
    picture: "https://avatars3.githubusercontent.com/u/944835?v=4&s=460"
  }
];

export function getOrganizationApproversStart() {
  return {
    type: GET_ORGANIZATION_APPROVERS_START
  };
}

export function gotOrganizationApprovers(approvers) {
  return {
    type: GOT_ORGANIZATION_APPROVERS,
    approvers
  };
}

export function gotOrganizationApproversFail() {
  return {
    type: GOT_ORGANIZATION_APPROVERS_FAIL
  };
}

export function getOrganizationApprovers() {
  return dispatch => {
    dispatch(getOrganizationApproversStart());
    setTimeout(() => {
      dispatch(gotOrganizationApprovers(fakeApprovers));
    }, 890);
  };
}
export function getOrganizationMembersStart() {
  return {
    type: GET_ORGANIZATION_MEMBERS_START
  };
}

export function gotOrganizationMembers(members) {
  return {
    type: GOT_ORGANIZATION_MEMBERS,
    members
  };
}

export function gotOrganizationMembersFail() {
  return {
    type: GOT_ORGANIZATION_MEMBERS_FAIL
  };
}

export function getOrganizationMembers() {
  return dispatch => {
    dispatch(getOrganizationMembersStart());
    setTimeout(() => {
      dispatch(gotOrganizationMembers(fakeMembers));
    }, 890);
  };
}

export const initialState = {
  isLoading: false,
  isLoadingApprovers: false,
  members: null,
  approvers: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ORGANIZATION_MEMBERS_START:
      return { ...state, isLoading: true };
    case GOT_ORGANIZATION_MEMBERS:
      return { ...state, members: action.members, isLoading: false };
    case GOT_ORGANIZATION_MEMBERS_FAIL:
      return { ...state, isLoading: false };
    case GET_ORGANIZATION_APPROVERS_START:
      return { ...state, isLoadingApprovers: true };
    case GOT_ORGANIZATION_APPROVERS:
      return {
        ...state,
        approvers: action.approvers,
        isLoadingApprovers: false
      };
    case GOT_ORGANIZATION_APPROVERS_FAIL:
      return { ...state, isLoadingApprovers: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
