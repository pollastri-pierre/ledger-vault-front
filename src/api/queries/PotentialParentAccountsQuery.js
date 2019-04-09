// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Account } from "data/types";
import { isSupportedAccount } from "utils/accounts";
import { deserializeAccount } from "api/transformations/Account";

type Input = void;
type Response = Account[];

// Fetch all accounts
export default class PotentialParentAccountsQuery extends ConnectionQuery<
  Input,
  Response,
> {
  uri =
    "/accounts?status=APPROVED&status=PENDING&status=PENDING_UPDATE&status=PENDING_UPDATE_VIEW_ONLY&status=VIEW_ONLY";

  responseSchema = schema.Account;

  filter = isSupportedAccount;

  deserialize = deserializeAccount;
}
