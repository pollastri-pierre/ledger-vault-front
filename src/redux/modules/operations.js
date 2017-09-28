import _ from 'lodash';
import axios from 'axios';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import queryString from 'query-string';
import operationsUtils from '../utils/operation';
import { getFakeList } from '../utils/operation';

export const GET_OPERATION_START = 'operations/GET_OPERATION_START';
export const GOT_OPERATION = 'operations/GOT_OPERATION';
export const GOT_OPERATION_FAIL = 'operations/GOT_OPERATION_FAIL';
export const OPERATION_CLOSE = 'operations/OPERATION_CLOSE';
export const SAVE_OPERATION_NOTE_START = 'operations/SAVE_OPERATION_NOTE_START';
export const SAVE_OPERATION_NOTE_SUCCESS = 'operations/SAVE_OPERATION_NOTE_SUCCESS';
export const SAVE_OPERATION_NOTE_FAIL = 'operations/SAVE_OPERATION_NOTE_FAIL';

export function saveOperationNoteStart() {
  return {
    type: SAVE_OPERATION_NOTE_START,
  };
};

export function saveOperationNoteFail(status) {
  return {
    type: SAVE_OPERATION_NOTE_FAIL,
    status
  };
};

export function saveOperationNoteSucces(idOperation, note) {
  return {
    type: SAVE_OPERATION_NOTE_SUCCESS,
    idOperation,
    note,
  };
};

export function saveOperationNote(idOperation) {
  return dispatch => {
    dispatch(saveOperationNoteStart());
    setTimeout(() => {
      dispatch(saveOperationNoteSucces(2));
    }, 2000);
    // dispatch(saveOperationNoteSuccess());
  };
};

export function getOperationStart(tabIndex) {
  return {
    type: GET_OPERATION_START,
    tabIndex,
  };
}

export function gotOperationFail(status) {
  return {
    type: GOT_OPERATION_FAIL,
    status,
  };
}

export function closeDetail() {
  return {
    type: OPERATION_CLOSE,
  };
}

export function close() {
  return (dispatch, getState) => {
    dispatch(closeDetail());

    const { routing } = getState();
    const prev = routing.location.pathname;

    dispatch(push(prev));
  };
}

export function gotOperation(operation) {
  return {
    type: GOT_OPERATION,
    operation,
  };
}

export function getOperation(idOperation) {
  return (dispatch, getState) => {
    dispatch(getOperationStart());

    const { operations } = getState().operations;
    // const find = _.find(operations, { id: idOperation });

    const operation = operationsUtils.findOperationDetails(idOperation, operations);

    if (operation) {
      dispatch(gotOperation(operation));
    } else {
      // we need to request the API to fetch the operation's data
      axios.get(`operations/${idOperation}`).then((result) => {
        dispatch(gotOperation(result.data));
      }).catch((e) => {
        dispatch(close());
        setTimeout(() => {
          dispatch(gotOperationFail(e.response.status));
        }, 800);
      });
    }
  };
}

export function getOperationFake(idOperation, tabIndex = 0) {
  return (dispatch, getState) => {
    dispatch(getOperationStart(tabIndex));

    const { operations } = getState().operations;
    const operation = operationsUtils.findOperationDetails(idOperation, operations);

    if (operation) {
      dispatch(gotOperation(operation));
    } else {
      // we need to request the API to fetch the operation's data
      setTimeout(() => {
        const operations = getFakeList();
        dispatch(gotOperation(operationsUtils.findOperationDetails(idOperation, operations)));
      }, 500);
    }
  };
}


export function openOperationModal(idOperation, tabIndex = 0) {
  return dispatch => {
    dispatch(push(`?operationDetail=${idOperation}&tab=${tabIndex}`));
  };
};

export const initialState = {
  operations: null,
  operationInModal: null,
  isLoadingOperations: false,
  isLoadingOperation: false,
  tabsIndex: 0,
};

// export function hydrateArrayWithOperationDetails = () => ();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_OPERATION_START:
      return { ...state, isLoadingOperation: true };
    case GOT_OPERATION: {
      let copy = _.cloneDeep(state.operations);
      if (!copy) {
        copy = [];
      }

      copy.push(action.operation);
      return { ...state, isLoadingOperation: false, operations: copy };
    }
    case OPERATION_CLOSE:
      return { ...state, isLoadingOperation: false, operationInModal: null };
    case GOT_OPERATION_FAIL:
      return { ...state, isLoadingOperation: false, operationInModal: null };
    case LOCATION_CHANGE: {
      const { search } = action.payload;
      const params = queryString.parse(search);
      if (params.operationDetail) {
        const tab = (params.tab) ? parseInt(params.tab, 0) : 0;
        return { ...state, operationInModal: params.operationDetail, tabsIndex: tab };
      }
      return state;
    }
    default:
      return state;
  }
}
