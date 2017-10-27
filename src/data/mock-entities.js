//@flow

import currencies from '../currencies';
const currenciesMap = {};
currencies.forEach(c => {
  currenciesMap[c.name] = c;
});

const genNote = i => ({
  id: i,
  title: 'Note ' + i,
  body:
    'This is a note label. Lorem ipsum, is it ok ? This is a note label. Lorem ipsum, is it ok ? ',
  created_at: '',
  author: {
    id: 1,
    pub_key: 'pubkey',
    firstname: 'Florent',
    name: 'Teissier',
    picture: '',
    register_date: '',
    u2f_device: 'blob',
    email: 'florent.teissier@ledger.fr',
    groups: ['group1']
  }
});

const defaultGenOperation = {
  time: new Date(2017, 9, 14, 9).toISOString(),
  account_id: '0',
  amount: 120000000,
  confirmations: 31,
  type: 'SEND'
};

const genOperation = opts => {
  const { uuid, time, account_id, amount, confirmations, type } = {
    ...defaultGenOperation,
    ...opts
  };
  return {
    uuid,
    currency_name: 'bitcoin',
    currency_family: 'BITCOIN',
    trust: {
      level: '',
      weight: 3,
      conflicts: ['conflict1'],
      origin: 'Ledger API'
    },
    confirmations,
    time,
    block: {},
    type,
    amount,
    reference_conversion: {
      currency_name: 'EUR',
      amount: Math.round(amount * 0.0005)
    },
    fees: 23,
    account_id,
    senders: ['0xc5a96db085dda36ffbe390f455315d30d6d3dc52'],
    recipients: ['0x063dd253c8da4ea9b12105781c9611b8297f5d14'],
    notes: [genNote(1), genNote(2)],
    transaction: {
      version: '',
      hash: 'e46a1467e7cb83b737791b7ae1e351b7941cba51cfd01973981ab55e6f20f2be',
      lock_time: '',
      inputs: [
        {
          value: 50000,
          index: 3,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: ''
        },
        {
          value: 2000,
          index: 9,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: ''
        },
        {
          value: 50000,
          index: 8,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: ''
        },
        {
          value: 2000,
          index: 1,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: ''
        },
        {
          value: 50000,
          index: 0,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: ''
        },
        {
          value: 2000,
          index: 7,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: ''
        }
      ],
      outputs: [
        {
          index: 3,
          value: 33,
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          script: ''
        },
        {
          index: 9,
          value: 33,
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          script: ''
        },
        {
          index: 123,
          value: 33,
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          script: ''
        }
      ]
    }
  };
};

export default {
  operations: {
    '1': genOperation({ uuid: '1' }),
    '2': genOperation({
      uuid: '2',
      amount: 100000000,
      account_id: '1',
      time: new Date(2017, 9, 9).toISOString()
    }),
    '3': genOperation({
      uuid: '3',
      time: new Date(2017, 9, 10).toISOString(),
      amount: 200000000,
      account_id: '2'
    }),
    '4': genOperation({
      uuid: '4',
      confirmations: 0,
      account_id: '3',
      time: new Date(2017, 9, 11).toISOString()
    }),
    '5': genOperation({
      uuid: '5',
      amount: -130000000,
      account_id: '4',
      type: 'FROM',
      time: new Date(2017, 9, 12).toISOString()
    }),
    '6': genOperation({
      uuid: '6',
      time: new Date(2017, 9, 13).toISOString()
    }),
    '7': genOperation({
      uuid: '7',
      amount: 180000000,
      confirmations: 0,
      time: new Date(2017, 9, 14, 9).toISOString()
    }),
    '8': genOperation({
      uuid: '8',
      type: 'FROM',
      time: new Date(2017, 9, 15).toISOString()
    }),
    '9': genOperation({
      uuid: '9',
      amount: -150000000,
      time: new Date(2017, 9, 16).toISOString()
    }),
    '10': genOperation({
      uuid: '10',
      time: new Date(2017, 9, 17).toISOString()
    }),
    '11': genOperation({
      uuid: '11',
      amount: 100000000,
      time: new Date(2017, 9, 18, 5).toISOString()
    }),
    '12': genOperation({
      uuid: '12',
      time: new Date(2017, 9, 19).toISOString(),
      amount: 200000000
    }),
    '13': genOperation({
      uuid: '13',
      confirmations: 0,
      time: new Date(2017, 9, 20).toISOString()
    }),
    '14': genOperation({
      uuid: '14',
      type: 'FROM',
      time: new Date(2017, 9, 21).toISOString()
    }),
    '15': genOperation({
      uuid: '15',
      time: new Date(2017, 9, 22).toISOString()
    })
  },
  accounts: {
    '0': {
      id: '0',
      name: 'cold storage',
      creation_time: 1508923040570,
      currency: 'bitcoin',
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      reference_conversion: {
        balance: 199553,
        currency_name: 'EUR'
      }
    },
    '1': {
      id: '1',
      name: 'cold storage',
      creation_time: 1508923040570,
      currency: 'bitcoin',
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      reference_conversion: {
        balance: 199553,
        currency_name: 'EUR'
      }
    },
    '2': {
      id: '2',
      name: 'trackerfund',
      creation_time: 1508923040570,
      currency: 'dogecoin',
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      reference_conversion: {
        balance: 199553,
        currency_name: 'EUR'
      }
    },
    '3': {
      id: '3',
      name: 'hot wallet',
      creation_time: 1508923040570,
      currency: 'dash',
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      reference_conversion: {
        balance: 199553,
        currency_name: 'EUR'
      }
    },
    '4': {
      id: '4',
      name: 'etf holdings',
      creation_time: 1508923040570,
      currency: 'litecoin',
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      reference_conversion: {
        balance: 199553,
        currency_name: 'EUR'
      }
    }
  },
  // currencies are statically provided, we add them in the entities mock
  currencies: currenciesMap,
};
