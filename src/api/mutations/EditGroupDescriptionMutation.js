// @flow
import Mutation from "restlay/Mutation";
import type { Group } from "data/types";
import { success, error } from "formatters/notification";
import schema from "data/schema";

type In = {
  group: Group,
  description: string,
};

type Res = Group;

export default class EditGroupDescriptionMutation extends Mutation<In, Res> {
  method = "PUT";

  uri = `/groups/${this.props.group.id}`;

  responseSchema = schema.Group;

  getSuccessNotification() {
    return success("group's description", "saved");
  }

  getErrorNotification(e: Error) {
    return error("group's description", "saved", e);
  }

  getBody() {
    const { description } = this.props;
    return { description };
  }
}
