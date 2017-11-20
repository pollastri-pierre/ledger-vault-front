//@flow
import Mutation from "../../restlay/Mutation";
import genericRenderNotif from "../../data/genericRenderNotif";

type Input = {
  operationId: string
};

type Response = void; // FIXME what should it be?

export default class AbortOperationMutation extends Mutation<Input, Response> {
  uri = `/operations/${this.props.operationId}`;
  method = "DELETE";
  successNotification = genericRenderNotif("operation request", "DELETE");

  // TODO implement optimisticUpdater
}
