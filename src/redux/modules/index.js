//@flow
import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import operations from "./operations";
import accounts from "./accounts";
import accountCreation from "./account-creation";
import operationCreation from "./operation-creation";
import data from "./data";

const reducers = {
  locale,
  auth,
  alerts,
  operations,
  accounts,
  accountCreation,
  operationCreation,
  data
};

export default reducers;
