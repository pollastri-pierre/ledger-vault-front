// @flow

import Mutation from "restlay/Mutation";

type Data = {
  username: string,
  u2f_register: string,
  pub_key: string,
  key_handle: string,
  validation: {
    public_key: string,
    attestation: string,
  },
  confidentiality: {
    public_key: string,
    attestation: string,
  },
};

type Input = {
  urlID: string,
  body: Data,
};

type Response = *;

export default class RegisterUserMutation extends Mutation<Input, Response> {
  method = "POST";

  uri = `/requests/registration/${this.props.urlID}/authenticate`;

  getBody() {
    return this.props.body;
  }
}
