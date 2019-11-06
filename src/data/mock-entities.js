/* eslint-disable import/extensions */
// FIXME for no reason jest can't handle normal import, so forced
// to import like this:
import BigNumber from "bignumber.js/bignumber.js";
/* eslint-enable import/extensions */

import faker from "faker";
import keyBy from "lodash/keyBy";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { RequestActivityTypeList } from "data/types";

import { listCryptoCurrencies } from "utils/cryptoCurrencies";

const FAKE_USER_NAMES = [
  "Laura Parker",
  "Mark Walker",
  "Sally Wilson",
  "Florian Schreiber",
  "Claudia Schmitt",
  "Sean Grey",
  "Nicole Watkins",
  "Andrew Williams",
  "Allison Stowe",
  "Aidan Fisher",
  "Rebecca Hopper",
  "Tyler Flynn",
  "Kathy Sanchez",
  "Christopher Barnes",
  "Linda Smith",
  "Thomas Lee",
  "Michelle Jacobsen",
  "John Clark",
  "Anna Wagner",
  "Charles Burnell",
];

const FAKE_ACCOUNT_NAMES = [
  "Coinhy.pe",
  "HeyBitcoin",
  "Coinplace",
  "John Smith",
  "Amanda Wong",
  "BlockchainPlanet",
  "Nakchain ETH",
  "WPNakamoto",
  "Block.Chain",
  "Syscoin",
  "Limecoin",
  "Chain2B",
  "Crypstock",
  "Vaultsy",
  "BTC Venture",
  "Cryptor",
  "Block@ic",
  "SFY Ltd.",
  "Capitalsy",
  "Central",
];

const FAKE_GROUP_NAMES = [
  "APAC Ops",
  "EMEA Ops",
  "America Ops",
  "Key accounts Ops",
];

faker.seed(parseInt(process.env.MOCK_SEED, 10) || 1234);

function genCurrency() {
  return faker.random.arrayElement(listCryptoCurrencies(false));
}

function genApprovals(nb = 0, { users }) {
  const approvals = [];
  const usersCopy = [...users];
  for (let i = 0; i < nb; i++) {
    if (!usersCopy.length) continue; // eslint-disable-line no-continue
    const approval = genApproval({ users: usersCopy });
    approvals.push(approval);
    usersCopy.splice(usersCopy.indexOf(approval.created_by, 1));
  }
  return approvals;
}

function genApproval({ users }) {
  return {
    created_on: faker.date.recent(),
    created_by: faker.random.arrayElement(users),
    type: faker.random.arrayElement(["APPROVE", "ABORT"]),
  };
}

function getUniqueRandomElements(arr, nb) {
  const out = [];
  const arrCopy = [...arr];
  for (let i = 0; i < nb; i++) {
    if (!arrCopy.length) continue; // eslint-disable-line no-continue
    const el = faker.random.arrayElement(arrCopy);
    out.push(el);
    arrCopy.splice(arrCopy.indexOf(el), 1);
  }
  return out;
}

function genAccount({ users = [] } = {}, extra = {}) {
  const currency = genCurrency();
  const accountType = currency.family === "bitcoin" ? "Bitcoin" : "Ethereum";
  const operators = users.filter(m => m.role === "operator");
  const administrators = users.filter(m => m.role === "admin");
  const nbApprovalsToGenerate = faker.random.number({ min: 0, max: 3 });
  const approvals = genApprovals(nbApprovalsToGenerate, {
    users: administrators,
  });
  const nbApprovals = approvals.filter(a => a.type === "APPROVE").length;
  const status = approvals.find(a => a.type === "ABORT")
    ? "ABORTED"
    : nbApprovals >= 2
    ? "ACTIVE"
    : "PENDING_APPROVAL";
  return {
    id: faker.random.number({ min: 1, max: 100000000 }),
    index: faker.random.number({ min: 1, max: 10 }),
    name: faker.random.arrayElement(FAKE_ACCOUNT_NAMES),
    status,
    tx_approval_steps: [
      { quorum: 2, group: genGroup({ users }) },
      { quorum: 1, group: genGroup({ users, status: "ACTIVE" }) },
    ],
    currency: currency.id,
    account_type: accountType,
    contract_address: null,
    parent_id: null,
    users: getUniqueRandomElements(operators, 3),
    derivation_path: "44'/0'/0'",
    extended_public_key: {
      chain_code: "chain_code",
      public_key: "public_key",
    },
    xpub: "xpubMOCK",
    settings: {
      blockchain_explorer: "blockchain.info",
      currency_unit: currency.units[0],
      fiat: {
        confirmation_needed: 0,
        id: 1,
        issue_message: null,
        name: "Euro",
        type: "FIAT",
      },
    },
    security_scheme: { quorum: 2 },
    balance: BigNumber(
      faker.random.number({
        min: 0.3 * 10 ** currency.units[0].magnitude,
        max: 7 * 10 ** currency.units[0].magnitude,
        precision: 4,
      }),
    ),
    fresh_addresses: [
      { address: "1MfeDvj5AUBG4xVMrx1xPgmYdXQrzHtW5b", derivation_path: "0/2" },
    ],
    is_hsm_coin_app_updated: true,
    created_on: faker.date.recent(),
    approvals,

    number_of_approvals: nbApprovals,
    ...extra,
  };
}

export const genRequest = (
  type = "CREATE_GROUP",
  { target_type = "GROUP", status = "PENDING_APPROVAL" } = {},
) => {
  const created_on = faker.date.past(1);
  return {
    id: faker.random.alphaNumeric(40),
    created_on,
    created_by: 1,
    expired_at: faker.date.future(2),
    approvals: [],
    target_id: 1,
    target_type,
    type,
    status,
  };
};

export const genRequests = nb => {
  const res = [];
  for (let i = 0; i < nb; i++) {
    res.push(genRequest(faker.random.arrayElement(RequestActivityTypeList)));
  }
  return res;
};

function genUser() {
  const date = faker.date.past(1);
  const status = faker.random.arrayElement([
    "ACTIVE",
    "REVOKED",
    "PENDING_APPROVAL",
    "PENDING_REGISTRATION",
    "PENDING_REVOCATION",
  ]);
  return {
    id: faker.random.alphaNumeric(12),
    pub_key: `0x${faker.random.alphaNumeric(40)}`,
    user_id: `${faker.random.alphaNumeric(16)}`,
    username: faker.random.arrayElement(FAKE_USER_NAMES),

    role: faker.random.arrayElement(["admin", "operator"]),

    created_on: date,
    status,
  };
}

const genTransaction = ({ account, users }) => {
  const currency = getCryptoCurrencyById(account.currency);
  const magnitude = currency.units[0].magnitude;
  const date = faker.date.past(2);
  const amount = BigNumber(
    faker.random.number({
      min: 0.2 * 10 ** magnitude,
      max: 4 * 10 ** magnitude,
      precision: 4,
    }),
  );
  const feesAmount = BigNumber(faker.random.number({ min: 1000, max: 100000 }));
  const operators = users.filter(m => m.role === "operator");

  const nbApprovalsToGenerate = faker.random.number({ min: 0, max: 3 });
  const approvals = genApprovals(nbApprovalsToGenerate, { users: operators });
  const nbApprovals = approvals.filter(a => a.type === "APPROVE").length;

  const status = approvals.find(a => a.type === "ABORT")
    ? "ABORTED"
    : nbApprovals >= 2
    ? "APPROVED"
    : "PENDING_APPROVAL";

  return {
    id: faker.random.number({ min: 1, max: 1000000000 }),

    created_by: faker.random.arrayElement(operators),
    currency_family: currency.family,

    confirmations: faker.random.number(0, 1000),
    created_on: date,
    price: { amount },
    fees: { amount: feesAmount },
    type: faker.random.arrayElement(["SEND", "RECEIVE"]),
    amount,
    account_id: account.id,
    approved: [],
    senders: [],
    recipient: faker.random.alphaNumeric("15"),
    recipients: [],
    notes: [],
    transaction: {
      version: faker.random.alphaNumeric("10"),
      hash: faker.random.alphaNumeric("10"),
      lock_time: faker.random.alphaNumeric("10"),
      inputs: [
        {
          index: faker.random.number(1, 100),
          value: faker.random.number(100, 10000),
          address: faker.random.alphaNumeric("10"),
        },
      ],
      outputs: [
        {
          index: faker.random.number(1, 100),
          value: faker.random.number(100, 10000),
          address: faker.random.alphaNumeric("10"),
        },
      ],
    },
    approvals,
    status,
  };
};

function genGroup({ users, status }) {
  const operators = users.filter(m => m.role === "operator");
  const nbUsers = faker.random.number({
    min: 1,
    max: Math.min(operators.length, 10),
  });
  const admins = users.filter(m => m.role === "admin");
  const nbApprovalsToGenerate = faker.random.number({ min: 0, max: 3 });
  const approvals = genApprovals(nbApprovalsToGenerate, {
    users: admins,
  });
  return {
    id: faker.random.alphaNumeric(10),
    name: faker.random.arrayElement(FAKE_GROUP_NAMES),
    created_on: faker.date.past(1),
    is_internal: false,
    created_by: admins[faker.random.number({ min: 0, max: admins.length })],
    description: faker.company.catchPhrase(),
    status:
      status ||
      faker.random.arrayElement(["APPROVED", "PENDING_APPROVAL", "ABORTED"]),
    members: getUniqueRandomElements(operators, nbUsers).map(m => m.id),
    approvals,
  };
}

function genWithNoDups(genFn, uniqNames, uniqKey) {
  return (nb, params, extra) => {
    if (uniqNames.length < nb) {
      throw new Error(`Cant generate more than ${uniqNames.length} entities`);
    }
    const entities = [];
    for (let i = 0; i < nb; i++) {
      const entity = genFn(params, extra);
      if (!entity[uniqKey])
        throw new Error(`No key ${uniqKey} found in entity`);
      if (entities.find(e => e[uniqKey] === entity[uniqKey])) {
        i--;
      } else {
        entities.push(entity);
      }
    }
    return entities;
  };
}

export const genUsers = genWithNoDups(genUser, FAKE_USER_NAMES, "username");
export const genAccounts = genWithNoDups(
  genAccount,
  FAKE_ACCOUNT_NAMES,
  "name",
);
export const genGroups = genWithNoDups(genGroup, FAKE_GROUP_NAMES, "name");

export function genTransactions(nb, { accounts, users }) {
  const transactions = [];
  for (let i = 0; i < nb; i++) {
    const account = faker.random.arrayElement(accounts);
    transactions.push(genTransaction({ account, users }));
  }
  return transactions;
}

export function genAddress() {
  return {
    id: faker.random.number({ min: 1, max: 1000000000 }),
    currency: genCurrency().id,
    address: faker.random.alphaNumeric(40),
    name: faker.random.alphaNumeric(10),
  };
}
export function genAddresses(nb) {
  const addresses = [];
  for (let i = 0; i < nb; i++) {
    addresses.push(genAddress());
  }
  return addresses;
}

export function genWhitelists(nb, { users }) {
  const whitelists = [];
  for (let i = 0; i < nb; i++) {
    whitelists.push(genWhitelist({ users }));
  }
  return whitelists;
}

export function genWhitelist({ users }) {
  const admins = users.filter(m => m.role === "admin");
  const status = faker.random.arrayElement(["ACTIVE", "PENDING"]);
  const randomly = faker.random.number({ min: 1, max: 10 });
  let last_request = null;
  if (status === "ACTIVE" && randomly % 2 === 0) {
    last_request = genRequest("EDIT_WHITELIST", {
      target_type: "WHITELIST",
      status: "PENDING_APPROVAL",
    });
  }
  return {
    id: faker.random.number({ min: 1, max: 1000000000 }),
    created_by: faker.random.arrayElement(admins),
    created_on: faker.date.past(1),
    name: faker.company.companyName(),
    description: faker.company.catchPhrase(),
    approvals: [],
    status,
    addresses: genAddresses(3),
    last_request,
  };
}

const users = genUsers(20);
const accounts = genAccounts(20, { users });
const transactions = genTransactions(100, { accounts, users });
const whitelists = genWhitelists(10, { users });
const groups = genGroups(4, { users });

export default {
  accounts: keyBy(accounts, "id"),
  accountsArray: accounts,
  groups: keyBy(groups, "id"),
  groupsArray: groups,
  users: keyBy(users, "id"),
  usersArray: users,
  transactions: keyBy(transactions, "id"),
  whitelists: keyBy(whitelists, "id"),
  whitelistsArray: whitelists,
};
