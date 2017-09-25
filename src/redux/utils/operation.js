import _ from 'lodash';

const operationsUtils = {
  findOperationDetails: (idOperation, operations) => {
    const find = _.find(operations, { uuid: idOperation });
    const result = (find && find.details) ? find.details : null;
    return result;
  },
  mockOperation: {
    uuid: '1',
    currency_name: 'bitcoin',
    currency_family: 'BITCOIN',
    trust: {
      level: '',
      weight: 3,
      conflicts: ['conflict1'],
      origin: 'Ledger API',
    },
    confirmations: 31,
    time: 'Yesterday, 2:34 AM',
    block: {},
    type: 'SEND',
    amount: 120,
    fees: 23,
    account_id: 1,
    senders: ['0xc5a96db085dda36ffbe390f455315d30d6d3dc52'],
    recipients: ['0x063dd253c8da4ea9b12105781c9611b8297f5d14'],
    notes: [
      {
        id: 1,
        title: 'Note 1',
        body: 'This is a note label. Lorem ipsum, is it ok ? This is a note label. Lorem ipsum, is it ok ? ',
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
          groups: ['group1'],
        },
      },
      {
        id: 2,
        title: 'Note 2',
        body: 'This is a note label. Lorem ipsum, is it ok ? This is a note label. Lorem ipsum, is it ok ? ',
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
          groups: ['group1'],
        },
      },
    ],
    transaction: {
      version: '',
      hash: 'e46a1467e7cb83b737791b7ae1e351b7941cba51cfd01973981ab55e6f20f2be',
      lock_time: '',
      inputs: [
        {
          value: '0.005',
          index: 3,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: '',
        },
        {
          value: '0.02',
          index: 9,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: '',
        },
        {
          value: '0.005',
          index: 8,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: '',
        },
        {
          value: '0.02',
          index: 1,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: '',
        },
        {
          value: '0.005',
          index: 0,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: '',
        },
        {
          value: '0.02',
          index: 7,
          previous_tx_hash: '',
          previous_tx_output_index: '',
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          signature_script: '',
          coinbase: '',
          sequence: '',
        },
      ],
      outputs: [
        {
          index: 3,
          value: 33,
          address: '1MTAZHMFKEIJ06CHKHCNTTHQABYW',
          script: '',
        },
      ],
    },
  },
  getFakeList: () => {
    const arr = [];
    const op1 = _.cloneDeep(this.mockOperation);
    op1.uuid = '2'
    arr.push(op1);

    return arr;
  },
};

export function getFakeList() {
    return [
      {...operationsUtils.mockOperation, uuid: '2'},
      {...operationsUtils.mockOperation, uuid: '3', amount: -0.002, time: "Fri 3 Mar, 2:33 AM"},
      {...operationsUtils.mockOperation, uuid: '4'},
      {...operationsUtils.mockOperation, uuid: '9', confirmations: 0},
      {...operationsUtils.mockOperation, uuid: '5', type: 'FROM'},
      {...operationsUtils.mockOperation, uuid: '6'},
    ];
}

export default operationsUtils;
