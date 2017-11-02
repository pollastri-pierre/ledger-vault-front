// TODO I think we might reconsider this to be part of the data.
// or at least we will on client side, "rehydrate" our data store with these so they can evolve over time (e.g. for rates)
window.CRYPTO_CURRENCIES = [
  {
    name: "bitcoin",
    family: "Bitcoin",
    color: "#fcb653",
    rate: {
      value: 0.0061,
      currency_name: "EUR"
    },
    units: [
      {
        name: "bitcoin",
        code: "BTC",
        symbol: "Ƀ",
        magnitude: 8
      },
      {
        name: "",
        code: "mBTC",
        symbol: "mBTC",
        magnitude: 5
      }
    ]
  },
  {
    name: "dogecoin",
    family: "Dogecoin",
    color: "#65d196",
    rate: {
      value: 0.000000001,
      currency_name: "EUR"
    },
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
    rate: {
      value: 0.00000003,
      currency_name: "EUR"
    },
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
    rate: {
      value: 0.000245,
      currency_name: "EUR"
    },
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
    rate: {
      value: 0.000008,
      currency_name: "EUR"
    },
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
    rate: {
      value: 0.000044,
      currency_name: "EUR"
    },
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
