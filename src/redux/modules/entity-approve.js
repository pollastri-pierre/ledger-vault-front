import { LOGOUT } from "./auth";

export const OPEN_ENTITY_APPROVE = "approve-account/OPEN_ENTITY_APPROVE";
export const CLOSE_APPROVE = "approve-account/CLOSE_APPROVE";

export function openEntityApprove(entity, entityId, isApproved = false) {
  return {
    type: OPEN_ENTITY_APPROVE,
    entity,
    entityId,
    isApproved
  };
}

export function closeApprove() {
  return {
    type: CLOSE_APPROVE
  };
}

export const initialState = {
  modalOpened: false,
  isLoading: false,
  entity: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_ENTITY_APPROVE:
      return {
        ...state,
        modalOpened: true,
        entity: action.entity,
        entityId: action.entityId,
        isApproved: action.isApproved
      };
    case CLOSE_APPROVE:
      return initialState;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
