// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Account } from "data/types";

type Input = void;
type Response = Account[];

export default class AccountDashboardQuery extends Query<Input, Response> {
  uri =
    "/accounts/status/APPROVED,PENDING_UPDATE,VIEW_ONLY,PENDING_UPDATE_VIEW_ONLY";

  responseSchema = [schema.Account];
}
