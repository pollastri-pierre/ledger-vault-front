// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Whitelist } from "data/types";

type Input = {
  whitelistId: string,
};

type Response = Whitelist;

// Fetch a specific group
export default class WhitelistQuery extends Query<Input, Response> {
  uri = `/whitelists/${this.props.whitelistId}`;

  responseSchema = schema.Whitelist;
}
