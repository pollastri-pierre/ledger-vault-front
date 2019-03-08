// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import MemberQuery from "api/queries/MemberQuery";
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
    admin: MemberQuery
  },
  propsToQueryParams: props => ({
    memberId: props.match.params.memberId || ""
  })
});
