// import moment from "moment";
import Prando from "prando";
import { listCryptoCurrencies } from "utils/cryptoCurrencies";
import { account } from "./mock-base";

const allCurrencies = listCryptoCurrencies(true);

const getRandomCurrency = rng => {
  const randomInt = rng.nextInt(0, allCurrencies.length - 1);
  return allCurrencies[randomInt];
};

const getRandomName = rng => {
  const charset = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return `Account_${rng.nextString(rng.nextInt(1, 10), charset)}`;
};

// TODO handle ERC20
const ACCOUNT_TYPE_BY_CRYPTO_FAMILY = {
  ethereum: "Ethereum",
  bitcoin: "Bitcoin"
};

// TODO handle random security scheme
// TODO handle ERC20
const getRandomAccount = rng => {
  const currency = getRandomCurrency(rng);
  return {
    ...account,
    id: rng.nextInt(1000, 5000),
    name: getRandomName(rng),
    balance: rng.nextInt(account.balance, account.balance + 1000),
    account_type: ACCOUNT_TYPE_BY_CRYPTO_FAMILY[currency.family],
    currency_id: currency.id
  };
};

// TODO may be we want an helper to get 1 account for each available currency ?
export const getRandomAccounts = (number, seed) => {
  const rng = new Prando(seed);
  const accounts = [];
  for (let i = 0; i < number; i++) {
    accounts.push(getRandomAccount(rng));
  }
  return accounts;
};

// turn the array into an object so restlay can understand it
const randomAccounts = getRandomAccounts(4);
const keysAccounts = {};
for (let i = 0; i < randomAccounts.length; i++) {
  keysAccounts[randomAccounts[i].id] = randomAccounts[i];
}

// TODO mock other entities, operations, members..etc..
export default {
  accounts: keysAccounts
};
