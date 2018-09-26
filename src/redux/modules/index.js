//@flow
import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import accountCreation from "./account-creation";
import data from "./data";
import onboarding from "./onboarding";
import updateAccounts from "./update-accounts";
import exchanges from "./exchanges";
import CounterValues from "data/CounterValues";

const reducers = {
  locale,
  auth,
  alerts,
  accountCreation,
  onboarding,
  data,
  updateAccounts,
  exchanges,
  countervalues: CounterValues.reducer
};

export default reducers;
