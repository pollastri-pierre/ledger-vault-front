// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Account } from "data/types";
import { isSupportedAccount } from "utils/accounts";
import { deserializeAccount } from "api/transformations/Account";

class AccountsToMigrateQuery extends ConnectionQuery<void, Account> {
  uri = "/accounts?status=MIGRATED";

  responseSchema = schema.Account;

  filter = isSupportedAccount;

  deserialize = deserializeAccount;

  pageSize = -1;
}

export default AccountsToMigrateQuery;
