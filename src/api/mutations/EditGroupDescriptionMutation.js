// @flow
import Mutation from "restlay/Mutation";
import type { Group } from "data/types";
import { success } from "formatters/notification";
import schema from "data/schema";

type In = {
  groupId: number,
  description: string,
};

type Res = Group;

export default class EditGroupDescriptionMutation extends Mutation<In, Res> {
  method = "PUT";

  uri = `/groups/${this.props.groupId}`;

  responseSchema = schema.Group;

  getSuccessNotification = () => {
    return success("Group's description", "saved");
  };

  getBody() {
    const { description } = this.props;
    return { description };
  }
}
