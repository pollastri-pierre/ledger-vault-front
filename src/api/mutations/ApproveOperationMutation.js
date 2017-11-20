//@flow
import Mutation from "../../restlay/Mutation";
import genericRenderNotif from "../../data/genericRenderNotif";
import schema from "../../data/schema";
import type { Operation } from "../../data/types";

type In = {
  operationId: string
};

type Res = Operation;

export default class ApproveOperationMutation extends Mutation<In, Res> {
  uri = `/operations/${this.props.operationId}`;
  method = "PUT";
  successNotification = genericRenderNotif("operation request", "PUT");
  responseSchema = schema.Operation;

  // TODO implement optimisticUpdater
}
