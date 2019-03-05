import faker from "faker";
import keyBy from "lodash/keyBy";

import {
  getCryptoCurrencyById,
  listCryptoCurrencies
} from "utils/cryptoCurrencies";

const FAKE_MEMBER_NAMES = [
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
  "Charles Burnell"
];

const FAKE_ACCOUNT_NAMES = [
  "Coinhy.pe",
  "HeyBitcoin",
  "Coinplace",
  "John Smith",
  "Amanda Wong"
];

const FAKE_GROUP_NAMES = [
  "APAC Ops",
  "EMEA Ops",
  "America Ops",
  "Key accounts Ops"
];

faker.seed(parseInt(process.env.MOCK_SEED, 10) || 1234);

function genCurrency() {
  return faker.random.arrayElement(listCryptoCurrencies(false));
}

function genApprovals(nb = 0, { members }) {
  const approvals = [];
  const membersCopy = [...members];
  for (let i = 0; i < nb; i++) {
    if (!membersCopy.length) continue; // eslint-disable-line no-continue
    const approval = genApproval({ members: membersCopy });
    approvals.push(approval);
    membersCopy.splice(membersCopy.indexOf(approval.person, 1));
  }
  return approvals;
}

function genApproval({ members }) {
  return {
    created_on: faker.date.recent(),
    person: faker.random.arrayElement(members),
    type: faker.random.arrayElement(["APPROVE", "ABORT"])
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

function genAccount({ members = [] } = {}) {
  const currency = genCurrency();
  const accountType = currency.family === "bitcoin" ? "Bitcoin" : "Ethereum";
  const operators = members.filter(m => m.role === "operator");
  const administrators = members.filter(m => m.role === "admin");
  const nbApprovalsToGenerate = faker.random.number({ min: 0, max: 3 });
  const approvals = genApprovals(nbApprovalsToGenerate, {
    members: administrators
  });
  const nbApprovals = approvals.filter(a => a.type === "APPROVE").length;
  const status = approvals.find(a => a.type === "ABORT")
    ? "ABORTED"
    : nbApprovals >= 2
      ? "APPROVED"
      : "PENDING_APPROVAL";
  return {
    id: faker.random.number({ min: 1, max: 100000000 }),
    index: faker.random.number({ min: 1, max: 10 }),
    name: faker.random.arrayElement(FAKE_ACCOUNT_NAMES),
    status,
    currency_id: currency.id,
    account_type: accountType,
    contract_address: null,
    parent_id: null,
    members: getUniqueRandomElements(operators, 3),
    settings: {
      blockchain_explorer: "blockchain.info",
      currency_unit: currency.units[0],
      fiat: {
        confirmation_needed: 0,
        id: 1,
        issue_message: null,
        name: "Euro",
        type: "FIAT"
      }
    },
    security_scheme: { quorum: 2 },
    balance: faker.random.number({
      min: 0.3 * 10 ** currency.units[0].magnitude,
      max: 7 * 10 ** currency.units[0].magnitude,
      precision: 4
    }),
    fresh_addresses: [
      { address: "1MfeDvj5AUBG4xVMrx1xPgmYdXQrzHtW5b", derivation_path: "0/2" }
    ],
    is_hsm_coin_app_updated: true,
    created_on: faker.date.recent(),
    approvals,

    number_of_approvals: nbApprovals
  };
}

function genMember() {
  const date = faker.date.past(1);
  const status = faker.random.arrayElement([
    "ACTIVE",
    "REVOKED",
    "PENDING_APPROVAL",
    "PENDING_INVITATION",
    "PENDING_REVOCATION"
  ]);
  return {
    id: faker.random.alphaNumeric(12),
    pub_key: `0x${faker.random.alphaNumeric(40)}`,
    username: faker.random.arrayElement(FAKE_MEMBER_NAMES),

    role: faker.random.arrayElement(["admin", "operator"]),

    created_on: date,
    status
  };
}

const genOperation = ({ account, members }) => {
  const currency = getCryptoCurrencyById(account.currency_id);
  const magnitude = currency.units[0].magnitude;
  const date = faker.date.past(2);
  const amount = faker.random.number({
    min: 0.2 * 10 ** magnitude,
    max: 4 * 10 ** magnitude,
    precision: 4
  });
  const feesAmount = faker.random.number({ min: 1000, max: 100000 });
  const operators = members.filter(m => m.role === "operator");

  const nbApprovalsToGenerate = faker.random.number({ min: 0, max: 3 });
  const approvals = genApprovals(nbApprovalsToGenerate, { members: operators });
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
    recipient: [],
    recipients: [],
    transaction: {
      version: faker.random.alphaNumeric("10"),
      hash: faker.random.alphaNumeric("10"),
      lock_time: faker.random.alphaNumeric("10"),
      inputs: [
        {
          index: faker.random.number(1, 100),
          value: faker.random.number(100, 10000),
          address: faker.random.alphaNumeric("10")
        }
      ],
      outputs: [
        {
          index: faker.random.number(1, 100),
          value: faker.random.number(100, 10000),
          address: faker.random.alphaNumeric("10")
        }
      ]
    },
    approvals,
    status
  };
};

function genGroup({ members }) {
  const operators = members.filter(m => m.role === "operator");
  const nbMembers = faker.random.number({
    min: 1,
    max: Math.min(operators.length, 10)
  });
  const admins = members.filter(m => m.role === "admin");
  const nbApprovalsToGenerate = faker.random.number({ min: 0, max: 3 });
  const approvals = genApprovals(nbApprovalsToGenerate, {
    members: admins
  });
  const status = faker.random.arrayElement([
    "APPROVED",
    "PENDING_APPROVAL",
    "ABORTED"
  ]);
  return {
    id: faker.random.alphaNumeric("10"),
    name: faker.random.arrayElement(FAKE_GROUP_NAMES),
    created_on: faker.date.past(1),
    created_by: admins[faker.random.number({ min: 0, max: admins.length })],
    description: faker.company.catchPhrase(),
    status,
    members: getUniqueRandomElements(operators, nbMembers).map(m => m.id),
    approvals
  };
}

export function genMembers(nb = 0) {
  const members = [];
  for (let i = 0; i < nb; i++) {
    members.push(genMember());
  }
  return members;
}

export function genAccounts(nb, { members }) {
  const accounts = [];
  for (let i = 0; i < nb; i++) {
    accounts.push(genAccount({ members }));
  }
  return accounts;
}

export function genOperations(nb, { accounts, members }) {
  const operations = [];
  for (let i = 0; i < nb; i++) {
    const account = faker.random.arrayElement(accounts);
    operations.push(genOperation({ account, members }));
  }
  return operations;
}

export function genGroups(nb, { members }) {
  const groups = [];
  for (let i = 0; i < nb; i++) {
    groups.push(genGroup({ members }));
  }
  return groups;
}

const members = genMembers(40);
const accounts = genAccounts(10, { members });
const operations = genOperations(100, { accounts, members });
const groups = genGroups(40, { members });

export default {
  accounts: keyBy(accounts, "id"),
  accountsArray: accounts,
  groups: keyBy(groups, "id"),
  groupsArray: groups,
  members: keyBy(members, "id"),
  membersArray: members,
  operations: keyBy(operations, "id")
};
