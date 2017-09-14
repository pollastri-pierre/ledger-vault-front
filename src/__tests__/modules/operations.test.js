import moxios from 'moxios';
import reducer, {
  getOperationStart,
  gotOperationFail,
  getOperation,
  gotOperation,
  initialState,
  GET_OPERATION_START,
  GOT_OPERATION,
  GOT_OPERATION_FAIL,
} from '../../redux/modules/operations';

describe('Module operations', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  // testing actions
  it('getOperationStart should sent GET_OPERATION_START', () => {
    expect(getOperationStart()).toEqual({ type: GET_OPERATION_START });
  });

  it('gotOperationFail should sent GOT_OPERATION_FAIL', () => {
    expect(gotOperationFail()).toEqual({ type: GOT_OPERATION_FAIL });
  });

  it('getOperation should dispatch gotOperation with the operation if already cached', () => {
    const state = {
      operations: {
        operationInModal: null,
        operations: [{ id: 1 }],
        isLoadingOperation: true,
        isLoadgingOperations: false,
      },
    };

    const getState = () => state;
    const dispatch = jest.fn();
    const thunk = getOperation(1);

    thunk(dispatch, getState);

    const calls = dispatch.mock.calls;

    expect(calls[0][0]).toEqual({ type: GET_OPERATION_START });
    expect(calls[1][0]).toEqual({ type: GOT_OPERATION, operation: { id: 1 } });
  });

  it('getOperation should call the API if we dont have the operation cached', (done) => {
    const state = {
      operations: {
        operationInModal: null,
        operations: [],
        isLoadingOperation: true,
        isLoadgingOperations: false,
      },
    };

    const getState = () => state;
    const dispatch = jest.fn();
    const thunk = getOperation(1);

    thunk(dispatch, getState);

    const data = { id: 1 };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: data,
      }).then(() => {
        const calls = dispatch.mock.calls;
        expect(calls[0][0]).toEqual({ type: GET_OPERATION_START });
        expect(calls[1][0]).toEqual({ type: GOT_OPERATION, operation: { id: 1 } });
        done();
      });
    });
  });

  it('getOperation should handle failure from API', (done) => {
    const state = {
      operations: {
        operationInModal: null,
        operations: [],
        isLoadingOperation: true,
        isLoadgingOperations: false,
      },
    };

    const getState = () => state;
    const dispatch = jest.fn();
    const thunk = getOperation(1);

    thunk(dispatch, getState);

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
      }).then(() => {
        const calls = dispatch.mock.calls;
        expect(calls[0][0]).toEqual({ type: GET_OPERATION_START });
        expect(calls[1][0]).toEqual({ type: GOT_OPERATION_FAIL });
        done();
      });
    });
  });

  it('gotOperation should sent GOT_OPERATION and the operation', () => {
    expect(gotOperation({ id: 1 })).toEqual({ type: GOT_OPERATION, operation: { id: 1 } });
  });

  // testing reducer
  it('reducer should set isLoadingOperation to true when GET_OPERATION_START', () => {
    expect(reducer(initialState, { type: GET_OPERATION_START })).toEqual({
      ...initialState, isLoadingOperation: true,
    });
  });

  it('reducer should set isLoadingOperation to false and set the operation when GOT_OPERATION', () => {
    const state = { ...initialState, isLoadingOperation: true };
    expect(reducer(state, { type: GOT_OPERATION, operation: { id: 1 } })).toEqual({
      ...initialState, isLoadingOperation: false, operationInModal: { id: 1 },
    });
  });

  it('reducer should set isLoadingOperation to false when GOT_OPERATION_FAIL', () => {
    const state = { ...initialState, isLoadingOperation: true };
    expect(reducer(state, { type: GOT_OPERATION_FAIL })).toEqual({
      ...initialState, isLoadingOperation: false,
    });
  });
});
