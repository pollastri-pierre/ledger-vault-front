// @flow

// import moment from "moment";
import Prando from "prando";
import { listCryptoCurrencies } from "utils/cryptoCurrencies";
import type { Account } from "data/types";
import { account, member, group } from "./mock-base";

const allCurrencies = listCryptoCurrencies(true);

const getRandomCurrency = rng => {
  const randomInt = rng.nextInt(0, allCurrencies.length - 1);
  return allCurrencies[randomInt];
};

const getRandomName = (rng, prefix) => {
  const charset = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return `${prefix}_${rng.nextString(rng.nextInt(1, 10), charset)}`;
};
const getRandomEmail = rng => {
  const charset = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return `User_${rng.nextString(rng.nextInt(1, 10), charset)}@ledger.fr`;
};

// TODO handle ERC20
const ACCOUNT_TYPE_BY_CRYPTO_FAMILY = {
  ethereum: "Ethereum",
  bitcoin: "Bitcoin",
  ripple: "Ripple"
};

// TODO handle random security scheme
// TODO handle ERC20
const genAccount = rng => {
  const currency = getRandomCurrency(rng);
  return {
    ...account,
    id: rng.nextInt(1000, 5000),
    name: getRandomName(rng, "Account"),
    balance: rng.nextInt(account.balance, account.balance + 1000),
    account_type: ACCOUNT_TYPE_BY_CRYPTO_FAMILY[currency.family],
    currency_id: currency.id,
    settings: {
      ...account.settings,
      currency_unit: currency.units[0]
    }
  };
};

const genGroup = seed => {
  const rng = new Prando(seed);
  const nbMembers = rng.nextInt(2, 10);
  const members = genMembers(nbMembers, rng.nextString(10));
  return {
    ...group,
    id: rng.nextInt(1000, 5000),
    name: getRandomName(rng, "Group"),
    members
  };
};

export const genGroups = (number: number, seed: string) => {
  const groups = [];
  for (let i = 0; i < number; i++) {
    const rng = new Prando(`${seed}_${i}`);
    groups.push(genGroup(rng.nextString(10)));
  }
  return groups;
};

const genMember = rng => ({
  ...member,
  id: rng.nextInt(1000, 5000),
  username: getRandomName(rng, "User"),
  email: getRandomEmail(rng)
});

export const genMembers = (number: number, seed: string) => {
  const members = [];
  for (let i = 0; i < number; i++) {
    const rng = new Prando(`${seed}_${i}`);
    members.push(genMember(rng));
  }
  return members;
};

// TODO may be we want an helper to get 1 account for each available currency ?
export const genAccounts = (number: number, seed?: string) => {
  const rng = new Prando(seed);
  const accounts = [];
  for (let i = 0; i < number; i++) {
    accounts.push(genAccount(rng));
  }
  return accounts;
};

export const genOperation = (account: Account, rng: Prando) => {
  const currency = getRandomCurrency(rng);
  const date = new Date();
  const amount = rng.nextInt(100, 4444444);
  const feesAmount = rng.nextInt(100, 5555);
  return {
    id: rng.nextInt(0, 1000000),
    currency_name: currency.id,
    created_by: {
      id: rng.nextString(10),
      pub_key: rng.nextString(10),
      username: rng.nextString(10),
      picture: rng.nextString(10),
      register_date: rng.nextString(10),
      u2f_device: rng.nextString(10),
      email: rng.nextString(10),
      role: rng.nextString(10),
      groups: []
    },
    currency_family: currency.family,
    trust: {
      level: rng.nextString(10),
      weight: 1,
      conflicts: [rng.nextString(10)],
      origin: rng.nextString(10)
    },
    confirmations: rng.nextInt(0, 100),
    created_on: date,
    price: {
      amount
    },
    fees: {
      amount: feesAmount
    },
    type: rng.nextInt(0, 1) === 0 ? "SEND" : "RECEIVE",
    amount,
    account_id: account.id,
    approved: [],
    senders: [],
    recipient: [],
    recipients: [],
    transaction: {
      version: rng.nextString(10),
      hash: rng.nextString(10),
      lock_time: rng.nextString(10),
      inputs: [
        {
          index: rng.nextInt(0, 100),
          value: rng.nextInt(300, 100000),
          address: rng.nextString(24)
        }
      ],
      outputs: [
        {
          index: rng.nextInt(0, 50),
          value: rng.nextInt(400, 4420420),
          address: rng.nextString(24)
        }
      ]
    },
    approvals: [
      {
        created_on: date,
        person: {
          id: rng.nextString(10),
          pub_key: rng.nextString(10),
          username: rng.nextString(10),
          picture: rng.nextString(10),
          register_date: rng.nextString(10),
          u2f_device: rng.nextString(10),
          email: rng.nextString(10),
          role: rng.nextString(10),
          groups: [rng.nextString(10)]
        },
        type: "APPROVE"
      }
    ],
    status: "toto"
  };
};

export const genOperations = (
  nb: number,
  accounts: Account[],
  rng: Prando = new Prando()
) => {
  const ops = [];
  for (let i = 0; i < nb; i++) {
    const randomAccount =
      accounts[Math.round(accounts.length * Math.random()) % accounts.length];
    ops.push(genOperation(randomAccount, rng));
  }
  return ops;
};

// turn the array into an object so restlay can understand it
const randomAccounts = genAccounts(4);
const keysAccounts = {};
for (let i = 0; i < randomAccounts.length; i++) {
  keysAccounts[randomAccounts[i].id] = randomAccounts[i];
}
//
// turn the array into an object so restlay can understand it
const randomGroups = genGroups(10, "seed");
const keysGroups = {};
for (let i = 0; i < randomGroups.length; i++) {
  keysGroups[randomGroups[i].id] = randomGroups[i];
}

// TODO mock other entities, operations, members..etc..
export default {
  accounts: keysAccounts,
  groups: keysGroups
};
