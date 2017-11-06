import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import operations from "./operations";
import accountsInfo from "./accounts-info";
import accounts from "./accounts";
import accountCreation from "./account-creation";
import operationCreation from "./operation-creation";
import entityApprove from "./entity-approve";
import organization from "./organization";
import data from "./data";

const reducers = {
  locale,
  auth,
  alerts,
  operations,
  accounts,
  accountsInfo,
  entityApprove,
  accountCreation,
  operationCreation,
  organization,
  data
};

export default reducers;
