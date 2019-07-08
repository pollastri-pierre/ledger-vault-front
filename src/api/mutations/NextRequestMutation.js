// @flow
import Mutation from "restlay/Mutation";

type Input = {
  requestId: number,
};

type Response = Object; // TODO add Request type

export default class NextRequestMutation extends Mutation<Input, Response> {
  uri = `/requests/${this.props.requestId}/next`;

  method = "POST";
}
