// @flow
import counterValues from "data/counterValues";
import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import data from "./data";
import onboarding from "./onboarding";
import exchanges from "./exchanges";

const reducers = {
  locale,
  auth,
  alerts,
  onboarding,
  data,
  exchanges,
  countervalues: counterValues.reducer,
};

export default reducers;
