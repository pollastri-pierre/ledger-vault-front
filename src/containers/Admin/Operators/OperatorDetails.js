// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import UserQuery from "api/queries/UserQuery";
import Text from "components/base/Text";
import type { Member } from "data/types";

import SpinnerCard from "components/spinners/SpinnerCard";

import UserDetails from "containers/UserDetails";

type Props = {
  close: () => void,
  operator: Member
};

class OperatorDetails extends PureComponent<Props> {
  render() {
    const { close, operator } = this.props;

    return <UserDetails user={operator} close={close} />;
  }
}

const RenderLoading = () => <SpinnerCard />;
const RenderError = () => <Text>Render error todo</Text>;

export default connectData(OperatorDetails, {
  RenderError,
  RenderLoading,
  queries: {
    operator: UserQuery
  },
  propsToQueryParams: props => ({
    userID: props.match.params.userID || ""
  })
});
