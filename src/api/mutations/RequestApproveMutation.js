// @flow
import Mutation from "restlay/Mutation";

type Input = {
  requestID: string
};

type Response = *;

// NOTE: will be removed once integrated with the Approve flow
export default class RequestApproveMutation extends Mutation<Input, Response> {
  method = "POST";

  uri = `/requests/${this.props.requestID}/approve`;

  getBody() {
    // some temp stuff
    return {
      hgj: "ghfhf"
    };
  }
}
