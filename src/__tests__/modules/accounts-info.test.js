import reducer, * as accountsInfo from '../../redux/modules/accounts-info';

describe('AccountsInfo module', () => {
  it('getOperationsStart() should send GET_OPERATIONS_START and the idAccount', () => {
    expect(accountsInfo.getOperationsStart(1)).toEqual({
      type: accountsInfo.GET_OPERATIONS_START,
      idAccount: 1,
    });
  });

  it('gotOperations() should return GOT_OPERATIONS and the operations', () => {
    expect(accountsInfo.gotOperations([])).toEqual({
      type: accountsInfo.GOT_OPERATIONS,
      operations: [],
    });
  });

  it('gotOperationsFail() should return GOT_OPERATIONS_FAIL', () => {
    expect(accountsInfo.gotOperationsFail()).toEqual({
      type: accountsInfo.GOT_OPERATIONS_FAIL,
    });
  });

  it('getReceiveAddressStart() should send GET_RECEIVEADDRESS_START', () => {
    expect(accountsInfo.getReceiveAddressStart()).toEqual({
      type: accountsInfo.GET_RECEIVEADDRESS_START,
    });
  });

  it('gotReceiveAddress() should send GOT_RECEIVEADDRESS, the account and the address', () => {
    expect(accountsInfo.gotReceiveAddress(1, 'hash')).toEqual({
      type: accountsInfo.GOT_RECEIVEADDRESS,
      address: 'hash',
      idAccount: 1,
    });
  });

  it('gotReceiveAddressFail() should send GOT_RECEIVEADDRESS_FAIL, the account and the status', () => {
    expect(accountsInfo.gotReceiveAddressFail(1, 500)).toEqual({
      type: accountsInfo.GOT_RECEIVEADDRESS_FAIL,
      status: 500,
      idAccount: 1,
    });
  });

  it('getCountervalueStart() should send GET_COUNTERVALUE_START', () => {
    expect(accountsInfo.getCountervalueStart()).toEqual({
      type: accountsInfo.GET_COUNTERVALUE_START,
    });
  });

  it('gotCountervalue() should send GOT_COUNTERVALUE the idAccount and countervalue', () => {
    expect(accountsInfo.gotCountervalue(1, { id: 1 })).toEqual({
      type: accountsInfo.GOT_COUNTERVALUE,
      countervalue: { id: 1 },
      idAccount: 1,
    });
  });

  it('gotCountervalueFail() should send GOT_COUNTERVALUE_FAIL the idAccount and status', () => {
    expect(accountsInfo.gotCountervalueFail(1, 500)).toEqual({
      type: accountsInfo.GOT_COUNTERVALUE_FAIL,
      status: 500,
      idAccount: 1,
    });
  });

  it('getBalanceStart() should send GET_BALANCE_START', () => {
    expect(accountsInfo.getBalanceStart()).toEqual({
      type: accountsInfo.GET_BALANCE_START,
    });
  });

  it('gotBalance() should send GOT_BALANCE the idAccount and balance', () => {
    expect(accountsInfo.gotBalance(1, { id: 1 })).toEqual({
      type: accountsInfo.GOT_BALANCE,
      balance: { id: 1 },
      idAccount: 1,
    });
  });

  it('gotBalanceFail() should send GOT_BALANCE_FAIL the idAccount and status', () => {
    expect(accountsInfo.gotBalanceFail(1, 500)).toEqual({
      type: accountsInfo.GOT_BALANCE_FAIL,
      status: 500,
      idAccount: 1,
    });
  });

  /* testing reducer */

  it('reducer should set isLoadingBalance to true', () => {
    expect(reducer(accountsInfo.initialState, {
      idAccount: 1, type: accountsInfo.GET_BALANCE_START,
    })).toEqual({
      ...accountsInfo.initialState, idAccount: 1, isLoadingBalance: true,
    });
  });

  it('reducer should set isLoadingCounter to true', () => {
    expect(reducer(accountsInfo.initialState, {
      type: accountsInfo.GET_COUNTERVALUE_START,
    })).toEqual({
      ...accountsInfo.initialState, isLoadingCounter: true,
    });
  });

  it('reducer should set isLoadingAddress to true', () => {
    expect(reducer(accountsInfo.initialState, {
      type: accountsInfo.GET_RECEIVEADDRESS_START,
    })).toEqual({
      ...accountsInfo.initialState, isLoadingAddress: true,
    });
  });
});
