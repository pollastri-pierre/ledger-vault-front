/* fake redux store for testing */

const noop = function() {};

const fakeStore = getState => {
  const store = {
    subscribe: noop,
    dispatch: noop,
    getState: getState
  };

  return store;
};
export default fakeStore;
