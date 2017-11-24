//@flow
import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import RestlayProvider from "../RestlayProvider";
import { reducer } from "../dataStore";
import type { NetworkF } from "../dataStore";

export class NullComponent extends Component<{}> {
  render() {
    return null;
  }
}

export function flushPromises(): Promise<any> {
  return new Promise(resolve => setImmediate(resolve));
}

export const newStore = () =>
  createStore(
    combineReducers({
      data: reducer
    }),
    applyMiddleware(thunk)
  );

export const createRender = (
  network: NetworkF,
  connectDataOptDefaults?: Object,
  store?: * = newStore()
) => {
  const render = (children: React$Node) => (
    <Provider store={store}>
      <RestlayProvider
        network={network}
        connectDataOptDefaults={connectDataOptDefaults}
      >
        {children}
      </RestlayProvider>
    </Provider>
  );
  return render;
};

export const defer = () => {
  let resolve: () => void, reject: () => void;
  const promise: Promise<any> = new Promise((success, failure) => {
    resolve = success;
    reject = failure;
  });
  if (!resolve || !reject) throw new Error(); // never happen, to satisfy flow
  return { resolve, reject, promise };
};

// returns {network,tick}
// network function: can be passed to createRender
// tick function: needs to be called to redeem pending network calls. (also returns number of waiters)
// countTickWaiters function: gets the number of network call awaiting
export const networkFromMock = (
  syncMockFunction: Function
): {
  network: NetworkF,
  tick: () => number,
  countTickWaiters: () => number
} => {
  let tickD = defer();
  let tickWaiters = 0;
  const waitTick = () => {
    ++tickWaiters;
    return tickD.promise.then(() => {
      --tickWaiters;
    });
  };
  return {
    tick: () => {
      const nb = tickWaiters;
      tickD.resolve();
      tickD = defer();
      return nb;
    },
    countTickWaiters: () => tickWaiters,
    network: (uri, method, body) =>
      waitTick().then(() => syncMockFunction(uri, method, body))
  };
};

// Just a dumb test to ignore jest warning there is no tests
test("utils", () => {
  expect(createRender).toBeInstanceOf(Function);
});
