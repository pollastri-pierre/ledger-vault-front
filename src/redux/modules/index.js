// @flow
import counterValues from "data/counterValues";
import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import data from "./data";
import requestReplay from "./requestReplayStore";
import onboarding from "./onboarding";
import exchanges from "./exchanges";

const reducers = {
  locale,
  auth,
  alerts,
  onboarding,
  data,
  exchanges,
  requestReplay,
  countervalues: counterValues.reducer,
};

export default reducers;
