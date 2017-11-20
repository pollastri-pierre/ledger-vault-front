//@flow
import Mutation from "../../restlay/Mutation";
import schema from "../../data/schema";
import type { Account } from "../../data/types";

type Input = {
  // TODO define the input types here
};

type Response = Account; // the account that has been created

export default class NewAccountMutation extends Mutation<Input, Response> {
  uri = "/organization/account";
  method = "POST";
  successNotification = {
    title: "Account request created",
    content: "The account request has been successfully created"
  };

  responseSchema = schema.Member;

  getBody() {
    return this.props;
  }
}
