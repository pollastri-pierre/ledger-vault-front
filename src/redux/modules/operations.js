//@flow
import { LOCATION_CHANGE, push } from "react-router-redux";
import queryString from "query-string";

// FIXME this file should be removed to the new Route / Modal approach

export const OPEN_MODAL_OPERATION_DETAILS =
  "operations/OPEN_MODAL_OPERATION_DETAILS";
export const OPERATION_CLOSE_DETAILS = "operations/OPERATION_CLOSE_DETAILS";
export const SAVE_OPERATION_NOTE_START = "operations/SAVE_OPERATION_NOTE_START";
export const SAVE_OPERATION_NOTE_SUCCESS =
  "operations/SAVE_OPERATION_NOTE_SUCCESS";
export const SAVE_OPERATION_NOTE_FAIL = "operations/SAVE_OPERATION_NOTE_FAIL";

export function saveOperationNoteStart() {
  return {
    type: SAVE_OPERATION_NOTE_START
  };
}

export function saveOperationNoteFail(status: *) {
  return {
    type: SAVE_OPERATION_NOTE_FAIL,
    status
  };
}

export function saveOperationNoteSucces(idOperation: *, note: *) {
  return {
    type: SAVE_OPERATION_NOTE_SUCCESS,
    idOperation,
    note
  };
}

export function saveOperationNote() {
  return (dispatch: Function) => {
    dispatch(saveOperationNoteStart());
    setTimeout(() => {
      dispatch(saveOperationNoteSucces(2));
    }, 2000);
    // dispatch(saveOperationNoteSuccess());
  };
}

export function closeDetail() {
  return {
    type: OPERATION_CLOSE_DETAILS
  };
}

export function close() {
  return (dispatch: Function, getState: Function) => {
    dispatch(closeDetail());

    const { routing } = getState();
    const prev = routing.location.pathname;

    dispatch(push(prev));
  };
}

export function openOperationModal(idOperation: *, tabIndex: number = 0) {
  return (dispatch: Function) => {
    dispatch({ type: OPEN_MODAL_OPERATION_DETAILS, idOperation, tabIndex });
    dispatch(push(`?operationDetail=${idOperation}&tab=${tabIndex}`));
  };
}

type State = {
  tabsIndex: number,
  operationInModal: *
};

export const initialState: State = {
  operationInModal: null,
  tabsIndex: 0
};

// export function hydrateArrayWithOperationDetails = () => ();

export default function reducer(state: State = initialState, action: Object) {
  switch (action.type) {
    case OPEN_MODAL_OPERATION_DETAILS:
      return {
        ...state,
        operationInModal: action.idOperation,
        tabIndex: action.tabsIndex
      };
    case OPERATION_CLOSE_DETAILS:
      return { ...state, isLoadingOperation: false, operationInModal: null };
    case LOCATION_CHANGE: {
      const { search } = action.payload;
      const params = queryString.parse(search);
      if (params.operationDetail) {
        const tab = params.tab ? parseInt(params.tab, 0) : 0;
        return {
          ...state,
          operationInModal: params.operationDetail,
          tabsIndex: tab
        };
      }
      return state;
    }
    default:
      return state;
  }
}
