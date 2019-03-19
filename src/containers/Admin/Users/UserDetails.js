// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import UserQuery from "api/queries/UserQuery";
import Text from "components/base/Text";
import type { User } from "data/types";

import SpinnerCard from "components/spinners/SpinnerCard";

import UserDetails from "containers/UserDetails";

type Props = {
  close: () => void,
  user: User,
};

class AdminDetails extends PureComponent<Props> {
  render() {
    const { close, user } = this.props;

    return <UserDetails user={user} close={close} />;
  }
}

const RenderLoading = () => <SpinnerCard />;
const RenderError = () => <Text>Render error todo</Text>;

export default connectData(AdminDetails, {
  RenderError,
  RenderLoading,
  queries: {
    user: UserQuery,
  },
  propsToQueryParams: props => ({
    userID: props.match.params.userID || "",
  }),
});
