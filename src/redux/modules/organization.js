import { LOGOUT } from './auth';

export const GET_ORGANIZATION_MEMBERS_START = 'organization/GET_ORGANIZATION_MEMBERS_START';
export const GOT_ORGANIZATION_MEMBERS = 'organization/GOT_ORGANIZATION_MEMBERS';
export const GOT_ORGANIZATION_MEMBERS_FAIL = 'organization/GOT_ORGANIZATION_MEMBERS_FAIL';

const members = [
  {
    id: 1,
    name: 'Smith',
    firstname: 'Henrietta',
    role: 'Administrator',
  },
  {
    id: 2,
    name: 'McAndersen',
    firstname: 'Julie',
    role: 'Administrator',
    picture: 'http://yoursocialcom.eu/wp-content/uploads/avatar-1.png',
  },
  {
    id: 3,
    name: 'Josh',
    firstname: 'Emily',
    role: 'Operator',
    picture: 'http://www.marketaccessbd.com/wp-content/uploads/2014/08/avatar-8.png',
  },
  {
    id: 4,
    name: 'Galvok Jr',
    firstname: 'Peder',
    role: 'Operator',
  },
  {
    id: 5,
    name: 'St Mamba',
    firstname: 'Paul',
    role: 'Operator',
  },
  {
    id: 6,
    name: 'Teissier',
    firstname: 'Florent',
    role: 'Operator',
    picture: 'https://avatars3.githubusercontent.com/u/944835?v=4&s=460',
  },
];

export function getOrganizationMembersStart() {
  return {
    type: GET_ORGANIZATION_MEMBERS_START,
  };
}

export function gotOrganizationMembers(members) {
  return {
    type: GOT_ORGANIZATION_MEMBERS,
    members,
  };
}

export function gotOrganizationMembersFail() {
  return {
    type: GOT_ORGANIZATION_MEMBERS_FAIL,
  };
}

export function getOrganizationMembers() {
  return (dispatch) => {
    dispatch(getOrganizationMembersStart());
    setTimeout(() => {
      dispatch(gotOrganizationMembers(members));
    }, 890);
  };
}

const initialState = {
  isLoading: false,
  members: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GOT_ORGANIZATION_MEMBERS:
      return { ...state, members: action.members };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
