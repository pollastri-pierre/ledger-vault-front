// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import UserQuery from "api/queries/UserQuery";
import { CardError } from "components/base/Card";
import type { User } from "data/types";
import { GrowingSpinner } from "components/base/GrowingCard";

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

export default connectData(AdminDetails, {
  RenderError: CardError,
  RenderLoading: GrowingSpinner,
  queries: {
    user: UserQuery,
  },
  propsToQueryParams: props => ({
    userID: props.match.params.userID || "",
  }),
});
