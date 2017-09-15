import _ from 'lodash';
import axios from 'axios';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import queryString from 'query-string';

export const GET_OPERATION_START = 'operations/GET_OPERATION_START';
export const GOT_OPERATION = 'operations/GOT_OPERATION';
export const GOT_OPERATION_FAIL = 'operations/GOT_OPERATION_FAIL';
export const OPERATION_CLOSE = 'operations/OPERATION_CLOSE';


export function getOperationStart() {
  return {
    type: GET_OPERATION_START,
  };
}

export function gotOperationFail(status) {
  return {
    type: GOT_OPERATION_FAIL,
    status
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
    const find = _.find(operations, { id: idOperation });

    if (find) {
      dispatch(gotOperation(find));
    } else {
      // we need to request the API to fetch the operation's data
      axios.get(`operations/${idOperation}`).then((result) => {
        dispatch(gotOperation(result.data));
      }).catch((e) => {
        dispatch(gotOperationFail(e.response.status));
        dispatch(close());
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
    case OPERATION_CLOSE:
      return { ...state, isLoadingOperation: false, operationInModal: null };
    case GOT_OPERATION_FAIL:
      return { ...state, isLoadingOperation: false };
    case LOCATION_CHANGE: {
      const { search } = action.payload;
      const params = queryString.parse(search);
      if (params.operationDetail) {
        return { ...state, operationInModal: params.operationDetail };
      }
      return state;
    }
    default:
      return state;
  }
}
