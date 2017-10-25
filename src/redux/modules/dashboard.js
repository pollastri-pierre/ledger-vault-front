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
    value: 1589049,
    valueHistory: {
      yesterday: 1543125,
      week: 1031250,
      month: 2043125
    }
  },
  lastOperations: {
    operations: getOperationFakeList()
  },
  pending: {
    total: 7,
    events: getOperationFakeList()
      .map(data => ({ type: 'operation', data }))
      .concat(accountsMock.map(data => ({ type: 'account', data })))
      .sort((a, b) =>
        inferPendingDataMomentDate(a).diff(inferPendingDataMomentDate(b))
      )
  },
  accounts: [
    {
      id: 0,
      name: 'cold storage',
      balance: {
        currencyName: 'ethereum',
        value: 1589831782,
        valueHistory: {
          yesterday: 1182834846,
          week: 118283484,
          month: 2182834846
        },
        referenceConversion: {
          value: 199553,
          currencyName: 'EUR'
        }
      }
    },
    {
      id: 1,
      name: 'cold storage',
      balance: {
        currencyName: 'ethereum',
        value: 1589831782,
        valueHistory: {
          yesterday: 1182834846,
          week: 118283484,
          month: 2182834846
        },
        referenceConversion: {
          value: 199553,
          currencyName: 'EUR'
        }
      }
    },
    {
      id: 2,
      name: 'trackerfund',
      balance: {
        currencyName: 'ethereum',
        value: 1589831782,
        valueHistory: {
          yesterday: 1182834846,
          week: 118283484,
          month: 2182834846
        },
        referenceConversion: {
          value: 199553,
          currencyName: 'EUR'
        }
      }
    },
    {
      id: 3,
      name: 'hot wallet',
      balance: {
        currencyName: 'ethereum',
        value: 1589831782,
        valueHistory: {
          yesterday: 1182834846,
          week: 118283484,
          month: 2182834846
        },
        referenceConversion: {
          value: 199553,
          currencyName: 'EUR'
        }
      }
    },
    {
      id: 4,
      name: 'etf holdings',
      balance: {
        currencyName: 'ethereum',
        value: 1589831782,
        valueHistory: {
          yesterday: 1182834846,
          week: 118283484,
          month: 2182834846
        },
        referenceConversion: {
          value: 199553,
          currencyName: 'EUR'
        }
      }
    }
  ]
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
