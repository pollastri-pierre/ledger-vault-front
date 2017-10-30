import _ from "lodash";
import currencies from "../../currencies";

const operationsUtils = {
  findOperationDetails: (idOperation, operations) => {
    const find = _.find(operations, { uuid: idOperation });
    return find;
  },
  mockOperation: {
    uuid: "1",
    currency: currencies[0],
    currency_name: "bitcoin",
    currency_family: "BITCOIN",
    trust: {
      level: "",
      weight: 3,
      conflicts: ["conflict1"],
      origin: "Ledger API"
    },
    confirmations: 31,
    time: "Yesterday, 2:34 AM",
    block: {},
    type: "SEND",
    amount: 120000000,
    reference_conversion: {
      currency_name: "EUR",
      amount: 543210,
      fees: 239990
    },
    fees: 12000000,
    account_id: 0,
    senders: ["0xc5a96db085dda36ffbe390f455315d30d6d3dc52"],
    recipients: ["0x063dd253c8da4ea9b12105781c9611b8297f5d14"],
    notes: [
      {
        id: 1,
        title: "Note 1",
        body:
          "This is a note label. Lorem ipsum, is it ok ? This is a note label. Lorem ipsum, is it ok ? ",
        created_at: "",
        author: {
          id: 1,
          pub_key: "pubkey",
          firstname: "Florent",
          name: "Teissier",
          picture: "",
          register_date: "",
          u2f_device: "blob",
          email: "florent.teissier@ledger.fr",
          groups: ["group1"]
        }
      },
      {
        id: 2,
        title: "Note 2",
        body:
          "This is a note label. Lorem ipsum, is it ok ? This is a note label. Lorem ipsum, is it ok ? ",
        created_at: "",
        author: {
          id: 1,
          pub_key: "pubkey",
          firstname: "Florent",
          name: "Teissier",
          picture: "",
          register_date: "",
          u2f_device: "blob",
          email: "florent.teissier@ledger.fr",
          groups: ["group1"]
        }
      }
    ],
    transaction: {
      version: "",
      hash: "e46a1467e7cb83b737791b7ae1e351b7941cba51cfd01973981ab55e6f20f2be",
      lock_time: "",
      inputs: [
        {
          value: "0.005",
          index: 3,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: "0.02",
          index: 9,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: "0.005",
          index: 8,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: "0.02",
          index: 1,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: "0.005",
          index: 0,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: "0.02",
          index: 7,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        }
      ],
      outputs: [
        {
          index: 3,
          value: 33,
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          script: ""
        },
        {
          index: 9,
          value: 33,
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          script: ""
        },
        {
          index: 123,
          value: 33,
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          script: ""
        }
      ]
    }
  }
};

export function getFakeList() {
  return [
    {
      ...operationsUtils.mockOperation,
      uuid: "1",
      time: new Date(2017, 9, 8, 22),
      currency: currencies[0]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "2",
      amount: 100000000,
      reference_conversion: {
        currency_name: "EUR",
        amount: 300000,
        fees: 232222
      },
      account_id: 1,
      time: new Date(2017, 9, 9),
      currency: currencies[1]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "3",
      time: new Date(2017, 9, 10),
      amount: 200000000,
      account_id: 2,
      reference_conversion: {
        currency_name: "EUR",
        amount: 600000,
        fees: 200000
      },
      currency: currencies[0]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "4",
      confirmations: 0,
      account_id: 3,
      time: new Date(2017, 9, 11),
      currency: currencies[0]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "5",
      amount: -130000000,
      account_id: 4,
      reference_conversion: {
        currency_name: "EUR",
        amount: -200000,
        fees: 222220
      },
      type: "FROM",
      time: new Date(2017, 9, 12),
      currency: currencies[1]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "6",
      time: new Date(2017, 9, 13),
      currency: currencies[0]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "7",
      amount: 180000000,
      reference_conversion: {
        currency_name: "EUR",
        amount: 280000,
        fees: 22222
      },
      confirmations: 0,
      time: new Date(2017, 9, 14, 9),
      currency: currencies[1]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "8",
      type: "FROM",
      time: new Date(2017, 9, 15),
      currency: currencies[1]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "9",
      amount: -150000000,
      reference_conversion: {
        currency_name: "EUR",
        amount: -230000,
        fees: 222222
      },
      time: new Date(2017, 9, 16),
      currency: currencies[0]
    }
  ];
}

export function getOperationsToApprove() {
  return [
    {
      ...operationsUtils.mockOperation,
      uuid: "1",
      time: new Date(2017, 9, 8, 22),
      approved: ["wewoleoolele"]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "2",
      account_id: 2,
      amount: 1,
      time: new Date(2017, 9, 9),
      approved: ["fewewoleoolelewf"]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "3",
      time: new Date(2017, 9, 10),
      amount: 2,
      approved: ["fewwewoleoolelef"]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "4",
      account_id: 3,
      confirmations: 0,
      time: new Date(2017, 9, 11),
      approved: ["fdsfwewoleooleles"]
    }
  ];
}

export function getOperationsToWatch() {
  return [
    {
      ...operationsUtils.mockOperation,
      uuid: "10",
      time: new Date(2017, 9, 17),
      approved: ["fdsfs"]
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "11",
      amount: 1,
      time: new Date(2017, 9, 18, 5),
      approved: ["fdsfs"]
    }
  ];
}

export function getFakeNextList() {
  return [
    {
      ...operationsUtils.mockOperation,
      uuid: "10",
      time: new Date(2017, 9, 17)
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "11",
      amount: 100000000,
      time: new Date(2017, 9, 18, 5)
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "12",
      time: new Date(2017, 9, 19),
      amount: 200000000
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "13",
      confirmations: 0,
      time: new Date(2017, 9, 20)
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "14",
      type: "FROM",
      time: new Date(2017, 9, 21)
    },
    {
      ...operationsUtils.mockOperation,
      uuid: "15",
      time: new Date(2017, 9, 22)
    }
  ];
}

export default operationsUtils;
