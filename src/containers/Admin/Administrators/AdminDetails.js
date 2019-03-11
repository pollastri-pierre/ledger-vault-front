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
  admin: Member
};

class AdminDetails extends PureComponent<Props> {
  render() {
    const { close, admin } = this.props;

    return <UserDetails user={admin} close={close} />;
  }
}

const RenderLoading = () => <SpinnerCard />;
const RenderError = () => <Text>Render error todo</Text>;

export default connectData(AdminDetails, {
  RenderError,
  RenderLoading,
  queries: {
    admin: UserQuery
  },
  propsToQueryParams: props => ({
    userID: props.match.params.userID || ""
  })
});
