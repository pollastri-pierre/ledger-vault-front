//@flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import { error } from "formatters/notification";
import type { ActivityCommon } from "data/types";

type Input = {
  business_action_ids: number[]
};

type Response = ActivityCommon;

export default class MarkActivityAsReadMutation extends Mutation<
  Input,
  Response
> {
  uri = `/activity/mark_as_seen`;
  method = "POST";
  responseSchema = schema.Activity;

  // getSuccessNotification() {
  //     return false;
  // }

  getErrorNotification(e: Error) {
    return error("activity request", "mark as seen", e);
  }
  getBody() {
    return this.props;
  }
}
