// @flow
import Mutation from "restlay/Mutation";

type Input = {};

type Response = Object; // TODO add Request type

export default class NewRequestMutation extends Mutation<Input, Response> {
  uri = "/requests";

  method = "POST";

  getBody() {
    return this.props;
  }
}
