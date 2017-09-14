import _ from 'lodash';
import axios from 'axios';

export const GET_OPERATION_START = 'operations/GET_OPERATION_START';
export const GOT_OPERATION = 'operations/GOT_OPERATION';
export const GOT_OPERATION_FAIL = 'operations/GOT_OPERATION_FAIL';


export function getOperationStart() {
  return {
    type: GET_OPERATION_START,
  };
}

export function gotOperationFail() {
  return {
    type: GOT_OPERATION_FAIL,
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
    const find = _.find(operations, { id: idOperation });

    if (find) {
      dispatch(gotOperation(find));
    } else {
      // we need to request the API to fetch the operation's data
      axios.get(`operations/${idOperation}`).then((result) => {
        dispatch(gotOperation(result.data));
      }).catch(() => {
        dispatch(gotOperationFail());
      });
    }
  };
}

export const initialState = {
  operations: null,
  operationInModal: null,
  isLoadingOperations: false,
  isLoadingOperation: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_OPERATION_START:
      return { ...state, isLoadingOperation: true };
    case GOT_OPERATION:
      return { ...state, isLoadingOperation: false, operationInModal: action.operation };
    case GOT_OPERATION_FAIL:
      return { ...state, isLoadingOperation: false };
    default:
      return state;
  }
}
