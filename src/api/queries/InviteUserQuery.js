// @flow
import Query from "restlay/Query";

type Input = {
  urlID: string,
};

export default class InviteUserQuery extends Query<Input, *> {
  uri = `/requests/${this.props.urlID}`;
}
