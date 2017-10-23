import blurBG from './blurBG';
import profile from './profile';
import locale from './locale';
import auth from './auth';
import alerts from './alerts';
import operations from './operations';
import accountsInfo from './accounts-info';
import accounts from './accounts';
import accountCreation from './account-creation';
import operationCreation from './operation-creation';
import pendingRequests from './pending-requests';
import accountApprove from './account-approve';
import allCurrencies from './all-currencies';
import organization from './organization';

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
  allCurrencies,
  organization,
};

export default reducers;
