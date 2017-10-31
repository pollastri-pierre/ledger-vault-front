//@flow

import currencies from "../currencies";
const currenciesMap = {};
currencies.forEach(c => {
  currenciesMap[c.name] = c;
});

const genNote = i => ({
  id: "" + i,
  title: "Note " + i,
  body:
    "This is a note label. Lorem ipsum, is it ok ? This is a note label. Lorem ipsum, is it ok ? ",
  created_at: new Date(
    2017,
    9,
    1 + Math.round(20 * Math.random()),
    10
  ).toISOString(),
  author: "" + i % 5
});

const defaultGenOperation = {
  time: new Date(2017, 9, 14, 9).toISOString(),
  account_id: "0",
  amount: 120000000,
  confirmations: 31,
  type: "SEND",
  approved: [],
  currency_name: "bitcoin",
  currency_family: "BITCOIN"
};

const genPubKey = () =>
  Array(64)
    .fill(null)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

const genU2F = () =>
  Array(128)
    .fill(null)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

const genMember = fields => ({
  pub_key: genPubKey(),
  u2f_device: genU2F(),
  ...fields
});

const members = {
  "0": genMember({
    id: "0",
    pub_key: "hash",
    last_name: "Getto",
    first_name: "David",
    role: "Administrator",
    register_date: new Date(2017, 8, 1, 10).toISOString(),
    email: "david.getto@ledger.fr",
    groups: []
  }),
  "1": genMember({
    id: "1",
    last_name: "Smith",
    first_name: "Henrietta",
    role: "Administrator",
    register_date: new Date(2017, 9, 1, 9).toISOString(),
    email: "smith.henrietta@ledger.fr",
    groups: ["0"]
  }),
  "2": genMember({
    id: "2",
    last_name: "McAndersen",
    first_name: "Julie",
    role: "Administrator",
    picture: "http://yoursocialcom.eu/wp-content/uploads/avatar-1.png",
    register_date: new Date(2017, 9, 2, 9).toISOString(),
    email: "julie.mcanderson@ledger.fr",
    groups: ["0"]
  }),
  "3": genMember({
    id: "3",
    last_name: "Josh",
    first_name: "Emily",
    role: "Operator",
    picture:
      "http://www.marketaccessbd.com/wp-content/uploads/2014/08/avatar-8.png",
    register_date: new Date(2017, 9, 10, 9).toISOString(),
    email: "emily.josh@ledger.fr",
    groups: ["1"]
  }),
  "4": genMember({
    id: "4",
    last_name: "Galvok Jr",
    first_name: "Peder",
    role: "Operator",
    register_date: new Date(2017, 10, 2, 9).toISOString(),
    email: "peder.g@ledger.fr",
    groups: ["1"]
  }),
  "5": genMember({
    id: "5",
    last_name: "St Mamba",
    first_name: "Paul",
    role: "Operator",
    register_date: new Date(2017, 10, 10, 9).toISOString(),
    email: "paul.sm@ledger.fr",
    groups: []
  }),
  "6": genMember({
    id: "6",
    last_name: "Teissier",
    first_name: "Florent",
    role: "Operator",
    picture: "https://avatars3.githubusercontent.com/u/944835?v=4&s=460",
    register_date: new Date(2017, 10, 20, 9).toISOString(),
    email: "florent.teissier@ledger.fr",
    groups: ["0", "1"]
  })
};

const genSecurityScheme = () => ({
  quorum: 2,
  approvers: Object.keys(members)
    .slice(0, 2)
    .map(k => members[k])
    .filter(m => m.role === "Administrator")
    .map(m => m.pub_key),
  time_lock: 600,
  rate_limiter: {
    max_transaction: 10,
    time_slot: 300
  }
});

const genOperation = opts => {
  const {
    uuid,
    time,
    account_id,
    amount,
    confirmations,
    type,
    currency_name,
    currency_family
  } = {
    ...defaultGenOperation,
    ...opts
  };
  return {
    uuid,
    currency_name,
    currency_family,
    trust: {
      level: "",
      weight: 3,
      conflicts: ["conflict1"],
      origin: "Ledger API"
    },
    confirmations,
    time,
    block: {},
    type,
    approved: [],
    amount,
    reference_conversion: {
      currency_name: "EUR",
      amount: Math.round(amount * 0.0005)
    },
    fees: 23,
    account_id,
    senders: ["0xc5a96db085dda36ffbe390f455315d30d6d3dc52"],
    recipients: ["0x063dd253c8da4ea9b12105781c9611b8297f5d14"],
    notes: [genNote(1), genNote(2)],
    transaction: {
      version: "",
      hash: "e46a1467e7cb83b737791b7ae1e351b7941cba51cfd01973981ab55e6f20f2be",
      lock_time: "",
      inputs: [
        {
          value: 50000,
          index: 3,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: 2000,
          index: 9,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: 50000,
          index: 8,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: 2000,
          index: 1,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: 50000,
          index: 0,
          previous_tx_hash: "",
          previous_tx_output_index: "",
          address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
          signature_script: "",
          coinbase: "",
          sequence: ""
        },
        {
          value: 2000,
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
  };
};

export default {
  groups: {
    "0": {
      id: "0",
      name: "First Group",
      members: ["1", "2", "6"]
    },
    "1": {
      id: "1",
      name: "Second Group",
      members: ["3", "4", "6"]
    }
  },
  members,
  operations: {
    "1": genOperation({ uuid: "1" }),
    "2": genOperation({
      uuid: "2",
      amount: 100000000,
      account_id: "1",
      time: new Date(2017, 9, 9).toISOString()
    }),
    "3": genOperation({
      uuid: "3",
      time: new Date(2017, 9, 10).toISOString(),
      amount: 200000000,
      account_id: "2"
    }),
    "4": genOperation({
      uuid: "4",
      confirmations: 0,
      account_id: "3",
      time: new Date(2017, 9, 11).toISOString()
    }),
    "5": genOperation({
      uuid: "5",
      amount: -130000000,
      account_id: "4",
      type: "FROM",
      time: new Date(2017, 9, 12).toISOString()
    }),
    "6": genOperation({
      uuid: "6",
      time: new Date(2017, 9, 13).toISOString()
    }),
    "7": genOperation({
      uuid: "7",
      amount: 180000000,
      confirmations: 0,
      time: new Date(2017, 9, 14, 9).toISOString()
    }),
    "8": genOperation({
      uuid: "8",
      type: "FROM",
      time: new Date(2017, 9, 15).toISOString()
    }),
    "9": genOperation({
      uuid: "9",
      amount: -150000000,
      time: new Date(2017, 9, 16).toISOString()
    }),
    "10": genOperation({
      uuid: "10",
      time: new Date(2017, 9, 17).toISOString()
    }),
    "11": genOperation({
      uuid: "11",
      amount: 100000000,
      time: new Date(2017, 9, 18, 5).toISOString()
    }),
    "12": genOperation({
      uuid: "12",
      time: new Date(2017, 9, 19).toISOString(),
      amount: 200000000
    }),
    "13": genOperation({
      uuid: "13",
      confirmations: 0,
      time: new Date(2017, 9, 20).toISOString(),
      currency_name: "litecoin",
      currency_family: "Litecoin"
    }),
    "14": genOperation({
      uuid: "14",
      type: "FROM",
      time: new Date(2017, 9, 21).toISOString(),
      currency_name: "litecoin",
      currency_family: "Litecoin"
    }),
    "15": genOperation({
      uuid: "15",
      time: new Date(2017, 9, 22).toISOString(),
      currency_name: "litecoin",
      currency_family: "Litecoin"
    }),
    "16": genOperation({
      uuid: "16",
      confirmations: 0,
      time: new Date(2017, 9, 20).toISOString(),
      amount: 40502021,
      currency_name: "dash",
      currency_family: "Dash"
    }),
    "17": genOperation({
      uuid: "17",
      type: "FROM",
      time: new Date(2017, 9, 21).toISOString(),
      amount: -40502021,
      currency_name: "dash",
      currency_family: "Dash"
    }),
    "18": genOperation({
      uuid: "18",
      time: new Date(2017, 9, 22).toISOString(),
      amount: 280502021,
      currency_name: "dash",
      currency_family: "Dash"
    })
  },
  accounts: {
    "0": {
      id: "0",
      name: "cold storage",
      security_scheme: genSecurityScheme(),
      creation_time: 1508923040570,
      currency: "bitcoin",
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      receive_address: "15rbHzwPeyb6yUfK8zyp7RUoDUznqoTrtx",
      reference_conversion: {
        balance: 199553,
        currency_name: "EUR"
      },
      approved: []
    },
    "1": {
      id: "1",
      name: "cold storage",
      security_scheme: genSecurityScheme(),
      creation_time: 1508923040570,
      currency: "bitcoin",
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      receive_address: "15rbHzwPeyb6yUfK8zyp7RUoDUznqoTrtx",
      reference_conversion: {
        balance: 199553,
        currency_name: "EUR"
      },
      approved: []
    },
    "2": {
      id: "2",
      name: "trackerfund",
      security_scheme: genSecurityScheme(),
      creation_time: 1508923040570,
      currency: "dogecoin",
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      receive_address: "15rbHzwPeyb6yUfK8zyp7RUoDUznqoTrtx",
      reference_conversion: {
        balance: 199553,
        currency_name: "EUR"
      },
      approved: ["hash"]
    },
    "3": {
      id: "3",
      name: "hot wallet",
      security_scheme: genSecurityScheme(),
      creation_time: 1508923040570,
      currency: "dash",
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      receive_address: "15rbHzwPeyb6yUfK8zyp7RUoDUznqoTrtx",
      reference_conversion: {
        balance: 199553,
        currency_name: "EUR"
      },
      approved: ["hash"]
    },
    "4": {
      id: "4",
      name: "etf holdings",
      security_scheme: genSecurityScheme(),
      creation_time: 1508923040570,
      currency: "litecoin",
      balance: 1589831782,
      balance_history: {
        yesterday: 1182834846,
        week: 118283484,
        month: 2182834846
      },
      receive_address: "15rbHzwPeyb6yUfK8zyp7RUoDUznqoTrtx",
      reference_conversion: {
        balance: 199553,
        currency_name: "EUR"
      },
      approved: []
    }
  },
  // currencies are statically provided, we add them in the entities mock
  currencies: currenciesMap
};
