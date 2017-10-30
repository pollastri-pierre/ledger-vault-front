import blurBG from "./blurBG";
import profile from "./profile";
import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import operations from "./operations";
import accountsInfo from "./accounts-info";
import accounts from "./accounts";
import accountCreation from "./account-creation";
import operationCreation from "./operation-creation";
import pendingRequests from "./pending-requests";
import accountApprove from "./account-approve";
import organization from "./organization";
import data from "./data";

const reducers = {
  blurBG,
  profile,
  locale,
  auth,
  alerts,
  operations,
  accounts,
  accountsInfo,
  accountApprove,
  pendingRequests,
  accountCreation,
  operationCreation,
  organization,
  data
};

export default reducers;
