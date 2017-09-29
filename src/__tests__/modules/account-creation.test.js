import reducer, * as module from '../../redux/modules/account-creation';

describe('AccountCreation module', () => {
  it('openModalAccount() should return OPEN_MODAL_ACCOUNT', () => {
    expect(module.openModalAccount()).toEqual({
      type: module.OPEN_MODAL_ACCOUNT,
    });
  });

  it('closeModalAccount() should return CLOSE_MODAL_ACCOUNT', () => {
    expect(module.closeModalAccount()).toEqual({
      type: module.CLOSE_MODAL_ACCOUNT,
    });
  });

  it('changeTab() should return CHANGE_TAB and the index', () => {
    expect(module.changeTab(1)).toEqual({
      type: module.CHANGE_TAB,
      index: 1,
    });
  });

  // testing reducer 
  //

  it('should set modalOpened to true', () => {
    expect(reducer(module.initialState, { type: module.OPEN_MODAL_ACCOUNT })).toEqual({
      ...module.initialState, modalOpened: true,
    });
  });

  it('should set modalOpened to false', () => {
    const state = { ...module.initialState, modalOpened: true };
    expect(reducer(state, { type: module.CLOSE_MODAL_ACCOUNT })).toEqual({
      ...module.initialState, modalOpened: false,
    });
  });

  it('should set modalOpened to false', () => {
    const state = { ...module.initialState, modalOpened: true };
    expect(reducer(state, { type: module.CLOSE_MODAL_ACCOUNT })).toEqual({
      ...module.initialState, modalOpened: false,
    });
  });

  it('should reset the state at logout', () => {
    const state = { ...module.initialState, modalOpened: true };
    expect(reducer(state, { type: module.CLOSE_MODAL_ACCOUNT })).toEqual(module.initialState);
  });
});
