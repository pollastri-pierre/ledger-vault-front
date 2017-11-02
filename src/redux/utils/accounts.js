import currencies from "../../currencies";
export const data = [
  {
    id: 0,
    name: "cold storage",
    creation_time: 1508923040570,
    currency: currencies[0],
    balance: 1589831782,
    security_scheme: {
      quorum: 2,
      rate_limiter: {
        max_transaction: 2,
        time_slot: 300
      },
      time_lock: 5000,
      approvers: ["wewoleoolele", "ewfwekljfkujkljlkj"]
    },
    balance_history: {
      yesterday: 1182834846,
      week: 118283484,
      month: 2182834846
    },
    reference_conversion: {
      balance: 199553,
      currency_name: "EUR"
    }
  },
  {
    id: 1,
    name: "cold storage",
    creation_time: 1508923040570,
    currency: currencies[0],
    balance: 1589831782,
    security_scheme: {
      quorum: 1,
      rate_limiter: {
        max_transaction: 2,
        time_slot: 300
      },
      time_lock: 5000,
      approvers: ["wewoleoolele", "ewfwekljfkujkljlkj"]
    },
    balance_history: {
      yesterday: 1182834846,
      week: 118283484,
      month: 2182834846
    },
    reference_conversion: {
      balance: 199553,
      currency_name: "EUR"
    }
  },
  {
    id: 2,
    name: "trackerfund",
    creation_time: 1508923040570,
    currency: currencies[1],
    balance: 1589831782,
    security_scheme: {
      quorum: 1,
      rate_limiter: {
        max_transaction: 2,
        time_slot: 300
      },
      time_lock: 5000,
      approvers: ["wewoleoolele", "ewfwekljfkujkljlkj"]
    },
    balance_history: {
      yesterday: 1182834846,
      week: 118283484,
      month: 2182834846
    },
    reference_conversion: {
      balance: 199553,
      currency_name: "EUR"
    }
  },
  {
    id: 3,
    name: "hot wallet",
    creation_time: 1508923040570,
    currency: currencies[2],
    balance: 1589831782,
    security_scheme: {
      quorum: 1,
      rate_limiter: {
        max_transaction: 2,
        time_slot: 300
      },
      time_lock: 5000,
      approvers: ["wewoleoolele", "ewfwekljfkujkljlkj"]
    },
    balance_history: {
      yesterday: 1182834846,
      week: 118283484,
      month: 2182834846
    },
    reference_conversion: {
      balance: 199553,
      currency_name: "EUR"
    }
  },
  {
    id: 4,
    name: "etf holdings",
    creation_time: 1508923040570,
    currency: currencies[2],
    balance: 1589831782,
    security_scheme: {
      quorum: 1,
      rate_limiter: null,
      time_lock: null,
      approvers: ["wewoleoolele", "ewfwekljfkujkljlkj"]
    },
    balance_history: {
      yesterday: 1182834846,
      week: 118283484,
      month: 2182834846
    },
    reference_conversion: {
      balance: 199553,
      currency_name: "EUR"
    }
  }
];
