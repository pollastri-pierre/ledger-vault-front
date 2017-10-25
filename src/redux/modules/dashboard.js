//@flow
import moment from 'moment';
import { getFakeList as getOperationFakeList } from '../../redux/utils/operation';
import { data as accountsMock } from '../../redux/utils/accounts';

export const SET_TOTAL_BALANCE_FILTER = 'dashboard/SET_TOTAL_BALANCE_FILTER';

/*
totalBalanceFilter is to be specified..
*/
export const TotalBalanceFilters = {
  yesterday: { title: 'yesterday' },
  week: { title: 'a week ago' },
  month: { title: 'a month ago' }
};

export const setTotalBalanceFilter = (totalBalanceFilter: string) => ({
  type: SET_TOTAL_BALANCE_FILTER,
  totalBalanceFilter
});

const inferPendingDataMomentDate = ({ type, data }) =>
  type === 'account' ? moment(data.creation_time) : moment(data.time);

// NB this is a WIP, does not reflect yet all the data models
const initialState = {
  totalBalanceFilter: Object.keys(TotalBalanceFilters)[0],
  // these below are probably downloaded from a server... not yet made these async
  // also we need to think which we want to have here vs in other store
  totalBalance: {
    currencyName: 'EUR',
    date: new Date().toISOString(),
    value: 1589049,
    valueHistory: {
      yesterday: 1543125,
      week: 1031250,
      month: 2043125
    },
    accountsCount: 5,
    currenciesCount: 4,
    membersCount: 8
  },
  lastOperations: {
    operations: getOperationFakeList()
  },
  pending: {
    total: getOperationFakeList().length + accountsMock.length,
    totalOperations: getOperationFakeList().length,
    totalAccounts: accountsMock.length,
    events: getOperationFakeList()
      .map(data => ({ type: 'operation', data }))
      .concat(accountsMock.map(data => ({ type: 'account', data })))
      .sort((a, b) =>
        inferPendingDataMomentDate(a).diff(inferPendingDataMomentDate(b))
      )
  }
};

const reducers = {
  [SET_TOTAL_BALANCE_FILTER]: ({ totalBalanceFilter }) => ({
    totalBalanceFilter
  })
};

export default (state = initialState, action) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](action) }
    : state;
