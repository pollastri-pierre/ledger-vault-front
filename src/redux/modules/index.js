// @flow
import CounterValues from "data/CounterValues";
import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import data from "./data";
import onboarding from "./onboarding";
import updateAccounts from "./update-accounts";
import exchanges from "./exchanges";

const reducers = {
  locale,
  auth,
  alerts,
  onboarding,
  data,
  updateAccounts,
  exchanges,
  countervalues: CounterValues.reducer,
};

export default reducers;
