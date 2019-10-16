// @flow
import Mutation from "restlay/Mutation";
import type { Whitelist } from "data/types";
import { success } from "formatters/notification";
import schema from "data/schema";

type In = {
  whitelistId: number,
  description: string,
};

type Res = Whitelist;

export default class EditWhitelistDescriptionMutation extends Mutation<
  In,
  Res,
> {
  method = "PUT";

  uri = `/whitelists/${this.props.whitelistId}`;

  responseSchema = schema.Whitelist;

  getSuccessNotification = () => {
    return success("whitelist's description", "saved");
  };

  getBody() {
    const { description } = this.props;
    return { description };
  }
}
