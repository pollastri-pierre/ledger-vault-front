import reducer, * as module from '../../redux/modules/account-creation';

describe('AccountCreation module', () => {
  it('openModalAccount() should return OPEN_MODAL_ACCOUNT', () => {
    expect(module.openModalAccount()).toEqual({
      type: module.OPEN_MODAL_ACCOUNT,
    });
  });

  it('saveAccountStart() should return SAVE_ACCOUNT_START', () => {
    expect(module.saveAccountStart()).toEqual({
      type: module.SAVE_ACCOUNT_START,
    });
  });

  it('savedAccount() should return SAVED_ACCOUNT', () => {
    expect(module.savedAccount()).toEqual({
      type: module.SAVED_ACCOUNT,
    });
  });

  it('openPopBubble() should return OPEN_POPBUBBLE with anchor', () => {
    expect(module.openPopBubble({})).toEqual({
      type: module.OPEN_POPBUBBLE,
      anchor: {},
    });
  });

  it('enableTimeLock() should return ENABLE_TIMELOCK', () => {
    expect(module.enableTimeLock()).toEqual({
      type: module.ENABLE_TIMELOCK,
    });
  });

  it('enableRatelimiter() should return ENABLE_RATELIMITER', () => {
    expect(module.enableRatelimiter()).toEqual({
      type: module.ENABLE_RATELIMITER,
    });
  });

  it('changeFrequency(rate-limiter) should return CHANGE_FREQUEMCY_RATELIMITER and frequency', () => {
    expect(module.changeFrequency('rate-limiter', 3)).toEqual({
      type: module.CHANGE_FREQUEMCY_RATELIMITER,
      frequency: 3,
    });
  });

  it('changeFrequency(timelock) should return CHANGE_FREQUEMCY_TIMELOCK and frequency', () => {
    expect(module.changeFrequency('timelock', 3)).toEqual({
      type: module.CHANGE_FREQUEMCY_TIMELOCK,
      frequency: 3,
    });
  });

  it('changeTimeLock() should return CHANGE_TIMELOCK and number', () => {
    expect(module.changeTimeLock(3)).toEqual({
      type: module.CHANGE_TIMELOCK,
      number: 3,
    });
  });

  it('changeRatelimiter() should return CHANGE_RATELIMITER and number', () => {
    expect(module.changeRatelimiter(3)).toEqual({
      type: module.CHANGE_RATELIMITER,
      number: 3,
    });
  });

  it('addMember() should return ADD_MEMBER and member', () => {
    expect(module.addMember({})).toEqual({
      type: module.ADD_MEMBER,
      member: {},
    });
  });

  it('setApprovals() should return SET_APPROVALS and approvals', () => {
    expect(module.setApprovals(3)).toEqual({
      type: module.SET_APPROVALS,
      number: 3,
    });
  });

  it('removeMember() should return REMOVE_MEMBER and member', () => {
    expect(module.removeMember({})).toEqual({
      type: module.REMOVE_MEMBER,
      member: {},
    });
  });

  it('changeAccountName() should return CHANGE_ACCOUNT_NAME and name', () => {
    expect(module.changeAccountName('str')).toEqual({
      type: module.CHANGE_ACCOUNT_NAME,
      name: 'str',
    });
  });

  it('switchInternalModal() should return SWITCH_INTERN_MODAL and id', () => {
    expect(module.switchInternalModal(3)).toEqual({
      type: module.SWITCH_INTERN_MODAL,
      id: 3,
    });
  });

  it('selectCurrencyItem() should return SELECT_CURRENCY', () => {
    expect(module.selectCurrencyItem({})).toEqual({
      type: module.SELECT_CURRENCY,
      currency: {},
    });
  });

  it('selectCurrency() should dispatch selectCurrencyItem and changeTab to tab 1', () => {
    const thunk = module.selectCurrency({});
    const dispatch = jest.fn();

    thunk(dispatch);

    expect(dispatch.mock.calls[0][0]).toEqual({ type: module.SELECT_CURRENCY, currency: {} });
    expect(dispatch.mock.calls[1][0]).toEqual({ type: module.CHANGE_TAB, index: 1 });
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

  it('should set the account name', () => {
    expect(reducer(module.initialState, { type: module.CHANGE_ACCOUNT_NAME, name: 'name' })).toEqual({
      ...module.initialState,
      options: {
        ...module.initialState.options,
        name: 'name',
      },
    });
  });

  it('should add a member', () => {
    expect(reducer(module.initialState, { type: module.ADD_MEMBER, member: { id: 1, name: 'name' } })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        members: [{ id: 1, name: 'name' }],
      },
    });
  });

  it('should remove a member if we add an already existing member', () => {
    const state = {
      ...module.initialState,
      security: {
        ...module.initialState.security,
        members: ['hash'],
      },
    };

    expect(reducer(state, { type: module.ADD_MEMBER, member: 'hash' })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        members: [],
      },
    });
  });

  it('should set approvals', () => {
    expect(reducer(module.initialState, { type: module.SET_APPROVALS, number: '2' })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        approvals: '2',
      },
    });
  });

  it('should not set approvals if its not a number', () => {
    expect(reducer(module.initialState, { type: module.SET_APPROVALS, number: 'aa' })).toEqual(module.initialState);
  });

  it('should set the internModalId', () => {
    const state = { ...module.initialState, internModalId: 'main' };
    expect(reducer(state, { type: module.SWITCH_INTERN_MODAL, id: 'members' })).toEqual({
      ...module.initialState, internModalId: 'members',
    });
  });

  it('should enable TIMELOCK', () => {
    expect(reducer(module.initialState, { type: module.ENABLE_TIMELOCK })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        timelock: {
          ...module.initialState.security.timelock,
          enabled: true,
        },
      },
    });
  });

  it('should enable RATELIMITE', () => {
    expect(reducer(module.initialState, { type: module.ENABLE_RATELIMITER })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        ratelimiter: {
          ...module.initialState.security.ratelimiter,
          enabled: true,
        },
      },
    });
  });

  it('should disable TIMELOCK', () => {
    const state = {
      ...module.initialState,
      security: {
        ...module.initialState.security,
        timelock: {
          ...module.initialState.security.timelock,
          enabled: true,
        },
      },
    };

    expect(reducer(state, { type: module.ENABLE_TIMELOCK })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        timelock: {
          ...module.initialState.security.timelock,
          enabled: false,
        },
      },
    });
  });

  it('should disable RATELIMITER', () => {
    const state = {
      ...module.initialState,
      security: {
        ...module.initialState.security,
        ratelimiter: {
          ...module.initialState.security.ratelimiter,
          enabled: true,
        },
      },
    };

    expect(reducer(state, { type: module.ENABLE_RATELIMITER })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        ratelimiter: {
          ...module.initialState.security.ratelimiter,
          enabled: false,
        },
      },
    });
  });

  it('should change RATELIMITER', () => {
    expect(reducer(module.initialState, { type: module.CHANGE_RATELIMITER, number: '2' })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        ratelimiter: {
          ...module.initialState.security.ratelimiter,
          rate: '2',
        },
      },
    });
  });

  it('shouldnt change RATELIMITER if not number', () => {
    expect(reducer(module.initialState, { type: module.CHANGE_RATELIMITER, number: 'w' })).toEqual(module.initialState);
  });

  it('should change TIMELOCK', () => {
    expect(reducer(module.initialState, { type: module.CHANGE_TIMELOCK, number: '2' })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        timelock: {
          ...module.initialState.security.timelock,
          duration: '2',
        },
      },
    });
  });

  it('shouldnt change RATELIMITER if not number', () => {
    expect(reducer(module.initialState, { type: module.CHANGE_RATELIMITER, number: 'w' })).toEqual(module.initialState);
  });

  it('shouldnt change timelock frequency and set popBubble to false', () => {
    const state = {
      ...module.initialState,
      popBubble: true,
    };

    expect(reducer(state, { type: module.CHANGE_FREQUEMCY_TIMELOCK, frequency: 'f' })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        timelock: {
          ...module.initialState.security.timelock,
          frequency: 'f',
        },
      },
      popBubble: false,
    });
  });

  it('shouldnt change ratelimiter frequency and set popBubble to false', () => {
    const state = {
      ...module.initialState,
      popBubble: true,
    };

    expect(reducer(state, { type: module.CHANGE_FREQUEMCY_RATELIMITER, frequency: 'f' })).toEqual({
      ...module.initialState,
      security: {
        ...module.initialState.security,
        ratelimiter: {
          ...module.initialState.security.ratelimiter,
          frequency: 'f',
        },
      },
      popBubble: false,
    });
  });

  it('should set the currency', () => {
    expect(reducer(module.initialState, { type: module.SELECT_CURRENCY, currency: {} })).toEqual({
      ...module.initialState, currency: {},
    });
  });

  it('should set the popbubble to true', () => {
    expect(reducer(module.initialState, { type: module.OPEN_POPBUBBLE, anchor: '' })).toEqual({
      ...module.initialState, popBubble: true,
    });
  });

  it('should close the modal at SAVE_ACCOUNT_START', () => {
    const state = { ...module.initialState, modalOpened: true };
    expect(reducer(state, { type: module.SAVE_ACCOUNT_START })).toEqual(module.initialState);
  });

  it('should reset the state at SAVED_ACCOUNT', () => {
    const state = { ...module.initialState, modalOpened: true };
    expect(reducer(state, { type: module.SAVED_ACCOUNT })).toEqual(module.initialState);
  });

  it('should reset the state at logout', () => {
    const state = { ...module.initialState, modalOpened: true };
    expect(reducer(state, { type: module.CLOSE_MODAL_ACCOUNT })).toEqual(module.initialState);
  });
});
