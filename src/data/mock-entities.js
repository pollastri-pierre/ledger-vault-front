import moment from "moment";

const mockCurrencies = [
  {
    name: "bitcoin",
    family: "Bitcoin",
    color: "#fcb653",
    units: [
      {
        name: "bitcoin",
        code: "BTC",
        symbol: "Ƀ",
        magnitude: 8
      },
      {
        name: "mBTC",
        code: "mBTC",
        symbol: "Ƀ",
        magnitude: 5
      },
      {
        name: "satoshi",
        code: "satoshi",
        symbol: "Ƀ",
        magnitude: 0
      }
    ]
  },
  {
    name: "dogecoin",
    family: "Dogecoin",
    color: "#65d196",
    units: [
      {
        name: "dogecoin",
        code: "DOGE",
        symbol: "DOGE",
        magnitude: 8
      }
    ]
  },
  {
    name: "dash",
    family: "Dash",
    color: "#0e76aa",
    units: [
      {
        name: "dash",
        code: "DASH",
        symbol: "DASH",
        magnitude: 8
      }
    ]
  },
  {
    name: "ethereum",
    family: "Ethereum",
    color: "#27d0e2",
    units: [
      {
        name: "ethereum",
        code: "ETH",
        symbol: "ETH",
        magnitude: 8
      }
    ]
  },
  {
    name: "ethereum-classic",
    family: "Ethereum",
    color: "#3ca569",
    units: [
      {
        name: "Ethereum Classic",
        code: "ETH",
        symbol: "ETH",
        magnitude: 8
      }
    ]
  },
  {
    name: "litecoin",
    family: "Litecoin",
    color: "#cccccc",
    units: [
      {
        name: "Litecoin",
        code: "LTC",
        symbol: "LTC",
        magnitude: 8
      }
    ]
  }
];

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
  author: "mock_" + i % 5
});

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
  mock_0: genMember({
    id: 5,
    pub_key:
      "jxniljj6d2qocyhjl8go86f851s8ygtmxh7337f49g3die3ule3z6lho59ru75bj2aqcwv5j8ysqea04a9w2dpihxo8ni0d03k08",
    last_name: "Getto",
    first_name: "David",
    role: "Administrator",
    register_date: new Date(2017, 8, 1, 10).toISOString(),
    email: "david.getto@ledger.fr",
    groups: []
  }),
  mock_1: genMember({
    id: "mock_1",
    last_name: "Smith",
    first_name: "Henrietta",
    role: "Administrator",
    register_date: new Date(2017, 9, 1, 9).toISOString(),
    email: "smith.henrietta@ledger.fr",
    groups: ["0"]
  }),
  mock_2: genMember({
    id: "mock_2",
    last_name: "McAndersen",
    first_name: "Julie",
    role: "Administrator",
    picture: "http://yoursocialcom.eu/wp-content/uploads/avatar-1.png",
    register_date: new Date(2017, 9, 2, 9).toISOString(),
    email: "julie.mcanderson@ledger.fr",
    groups: ["0"]
  }),
  mock_3: genMember({
    id: "mock_3",
    last_name: "Josh",
    first_name: "Emily",
    role: "Operator",
    picture:
      "http://www.marketaccessbd.com/wp-content/uploads/2014/08/avatar-8.png",
    register_date: new Date(2017, 9, 10, 9).toISOString(),
    email: "emily.josh@ledger.fr",
    groups: ["1"]
  }),
  mock_4: genMember({
    id: "mock_4",
    last_name: "Galvok Jr",
    first_name: "Peder",
    role: "Operator",
    register_date: new Date(2017, 10, 2, 9).toISOString(),
    email: "peder.g@ledger.fr",
    groups: ["1"]
  }),
  mock_5: genMember({
    id: "mock_5",
    last_name: "St Mamba",
    first_name: "Paul",
    role: "Operator",
    register_date: new Date(2017, 10, 10, 9).toISOString(),
    email: "paul.sm@ledger.fr",
    groups: []
  }),
  mock_6: genMember({
    id: "mock_6",
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
  },
  auto_expire: null
});

const genTransaction = () => ({
  version: "?",
  hash: "e46a1467e7cb83b737791b7ae1e351b7941cba51cfd01973981ab55e6f20f2be",
  lock_time: new Date().toUTCString(),
  inputs: [
    {
      value: 50000,
      index: 3,
      previous_tx_hash: "",
      previous_tx_output_index: 0,
      address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
      signature_script: "",
      coinbase: "",
      sequence: 0xffffff
    },
    {
      value: 2000,
      index: 9,
      previous_tx_hash: "",
      previous_tx_output_index: 0,
      address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
      signature_script: "",
      coinbase: "",
      sequence: 0xffffff
    },
    {
      value: 50000,
      index: 8,
      previous_tx_hash: "",
      previous_tx_output_index: 0,
      address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
      signature_script: "",
      coinbase: "",
      sequence: 0xffffff
    },
    {
      value: 2000,
      index: 1,
      previous_tx_hash: "",
      previous_tx_output_index: 0,
      address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
      signature_script: "",
      coinbase: "",
      sequence: 0xffffff
    },
    {
      value: 50000,
      index: 0,
      previous_tx_hash: "",
      previous_tx_output_index: 0,
      address: "1MTAZHMCC8AFFFDKOTY6CHKHCNTTHQABYW",
      signature_script: "",
      coinbase: "",
      sequence: 0xffffff
    },
    {
      value: 2000,
      index: 7,
      previous_tx_hash: "",
      previous_tx_output_index: 0,
      address: "1MTAZHMFKEIJ06CHKHCNTTHQABYW",
      signature_script: "",
      coinbase: "",
      sequence: 0xffffff
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
});

const accounts = {
  "0": {
    id: "0",
    name: "cold storage",
    security_scheme: genSecurityScheme(),
    creation_time: new Date().toUTCString(),
    currency: "bitcoin",
    currencyRate: {
      value: 0.008,
      fiat: "USD"
    },
    currencyRateInReferenceFiat: {
      value: 0.008,
      fiat: "USD"
    },
    settings: {
      unitIndex: 0,
      fiat: "USD",
      countervalueSource: "kraken",
      blockchainExplorer: "blockchain.info"
    },
    balance: 1589831782,
    balance_history: {
      yesterday: 1182834846,
      week: 118283484,
      month: 2182834846
    },
    receive_address: "1" + genPubKey().slice(0, 33),
    approved: []
  },
  "1": {
    id: "1",
    name: "cold storage",
    security_scheme: genSecurityScheme(),
    creation_time: new Date().toUTCString(),
    currency: "bitcoin",
    currencyRate: {
      value: 0.006,
      fiat: "EUR"
    },
    currencyRateInReferenceFiat: {
      value: 0.008,
      fiat: "USD"
    },
    settings: {
      unitIndex: 1,
      fiat: "EUR",
      countervalueSource: "kraken",
      blockchainExplorer: "blockchain.info"
    },
    balance: 189831782,
    balance_history: {
      yesterday: 182834846,
      week: 11283484,
      month: 182834846
    },
    receive_address: "1" + genPubKey().slice(0, 33),
    approved: []
  },
  "2": {
    id: "2",
    name: "trackerfund",
    security_scheme: genSecurityScheme(),
    creation_time: new Date().toUTCString(),
    currency: "dogecoin",
    currencyRate: {
      value: 0.000000001,
      fiat: "CNY"
    },
    currencyRateInReferenceFiat: {
      value: 0.0000000001,
      fiat: "USD"
    },
    settings: {
      unitIndex: 0,
      fiat: "CNY",
      countervalueSource: "btcchina",
      blockchainExplorer: "blockchain.info"
    },
    balance: 3258983178200000,
    balance_history: {
      yesterday: 0.6 * 3258983178200000,
      week: 0.7 * 3258983178200000,
      month: 0.9 * 3258983178200000
    },
    receive_address: "1" + genPubKey().slice(0, 33),
    approved: ["hash"]
  },
  "3": {
    id: "3",
    name: "hot wallet",
    security_scheme: genSecurityScheme(),
    creation_time: new Date().toUTCString(),
    currency: "dash",
    currencyRate: {
      value: 0.00000003,
      fiat: "EUR"
    },
    currencyRateInReferenceFiat: {
      value: 0.00000004,
      fiat: "USD"
    },
    settings: {
      unitIndex: 0,
      fiat: "EUR",
      countervalueSource: "kraken",
      blockchainExplorer: "blockchain.info"
    },
    balance: 99058831782000,
    balance_history: {
      yesterday: 99058831782000,
      week: 0.5 * 99058831782000,
      month: 0
    },
    receive_address: "1" + genPubKey().slice(0, 33),
    approved: ["hash"]
  },
  "4": {
    id: "4",
    name: "etf holdings",
    security_scheme: genSecurityScheme(),
    creation_time: new Date().toUTCString(),
    currency: "litecoin",
    currencyRate: {
      value: 0.000044,
      fiat: "EUR"
    },
    currencyRateInReferenceFiat: {
      value: 0.00006,
      fiat: "USD"
    },
    settings: {
      unitIndex: 0,
      fiat: "EUR",
      countervalueSource: "kraken",
      blockchainExplorer: "blockchain.info"
    },
    balance: 89158983182,
    balance_history: {
      yesterday: 99118234846,
      week: 11823484,
      month: 2218234846
    },
    receive_address: "1" + genPubKey().slice(0, 33),
    approved: []
  }
};

const defaultGenOperation = {
  time: new Date(2017, 9, 14, 9).toISOString(),
  account_id: "0",
  amount: 120000000,
  fees: 2300,
  confirmations: 31,
  type: "SEND",
  approved: [],
  currency_name: "bitcoin",
  currency_family: "BITCOIN",
  approvedTime: null,
  endOfTimeLockTime: null,
  endOfRateLimiterTime: null,
  exploreURL:
    "https://blockchain.info/address/17SkEw2md5avVNyYgj6RiXuQKNwkXaxFyQ"
};

const genOperation = opts => {
  const {
    uuid,
    time,
    account_id,
    amount,
    confirmations,
    type,
    currency_name,
    fees,
    currency_family,
    approvedTime,
    endOfTimeLockTime,
    endOfRateLimiterTime,
    approved,
    exploreURL
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
    approved,
    approvedTime,
    endOfTimeLockTime,
    endOfRateLimiterTime,
    amount,
    rate: accounts[account_id].currencyRate,
    fees,
    account_id,
    exploreURL,
    senders: ["0xc5a96db085dda36ffbe390f455315d30d6d3dc52"],
    recipients: ["0x063dd253c8da4ea9b12105781c9611b8297f5d14"],
    notes: [genNote(1), genNote(2)],
    transaction: genTransaction()
  };
};

const currencies = {};
mockCurrencies.forEach(c => {
  currencies[c.name] = c;
});

const groups = {
  "0": {
    id: "0",
    name: "First Group",
    members: ["mock_1", "mock_2", "mock_6"]
  },
  "1": {
    id: "1",
    name: "Second Group",
    members: ["mock_3", "mock_4", "mock_6"]
  }
};

const operations = {
  "1": genOperation({
    uuid: "1",
    amount: 100000000,
    account_id: "1",
    time: new Date(2016, 10, 2).toISOString()
  }),
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
    approved: ["hash"],
    time: new Date(2017, 9, 11).toISOString()
  }),
  "5": genOperation({
    uuid: "5",
    amount: -130000000,
    type: "FROM",
    approved: ["0", "1"],
    approvedTime: moment()
      .subtract(1, "hours")
      .toISOString(),
    endOfTimeLockTime: moment()
      .add(2, "hours")
      .toISOString(),
    endOfRateLimiterTime: moment()
      .add(28, "minutes")
      .toISOString(),
    time: new Date(2017, 9, 12).toISOString()
  }),
  "6": genOperation({
    uuid: "6",
    approved: ["0", "1"],
    approvedTime: moment()
      .subtract(2, "hours")
      .toISOString(),
    endOfTimeLockTime: moment()
      .add(12, "minutes")
      .toISOString(),
    time: new Date(2017, 9, 13).toISOString()
  }),
  "7": genOperation({
    uuid: "7",
    amount: 180000000,
    confirmations: 0,
    approved: ["0"],
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
};

for (let i = 0; i < 500; i += 1) {
  const uuid = "mock_ltc_" + i;
  const t = 1500000000000 + i * 23000000;
  operations[uuid] = genOperation({
    uuid,
    time: new Date(t).toISOString(),
    account_id: "4",
    amount:
      9999999 *
      (0.4 + Math.cos((t - 1500000000000 + Math.sin(t)) / 100)) *
      Math.exp((t - 1500000000000) / 1000000000),
    currency_name: "litecoin",
    currency_family: "Litecoin"
  });
}

const granularityRangeEg = {
  year: 0,
  month: 1,
  week: 2,
  day: 3
};
const dayInMs = 86400000;

const timeTable = {
  year: dayInMs * 365,
  month: dayInMs * 31,
  week: dayInMs * 7,
  day: dayInMs * 1
};

export const genBalance = (accountId, range) => {
  let balance = [];
  const begin_t = new Date().getTime() - timeTable[range]; //account creation date
  const final_t = new Date().getTime(); //Now
  const dt = final_t - begin_t;
  const nb_transac = 500;
  const granularity = 2 * (granularityRangeEg[range] + 1);
  const step = dt / (nb_transac / granularity); //step between each datapoint
  let t = begin_t;
  let date = begin_t;
  for (
    let i = 0;
    i < nb_transac && date <= final_t;
    i += granularity + Math.floor(Math.random() * 5)
  ) {
    date = t + step * i;
    balance.push([
      Math.min(final_t, date),
      100000000 *
        Math.max(
          0,
          999 * Math.exp(-dt / (t + step * i - begin_t)) +
            99 *
              (accountId + 1) *
              Math.sin(t) *
              Math.exp(Math.cos(t + step * i))
        )
    ]);
  }
  let counterValueBalance = balance.map(a => [a[0], a[1] * Math.random()]);
  return { balance: balance, counterValueBalance: counterValueBalance };
};

export default {
  groups,
  members,
  operations,
  accounts,
  currencies
};
