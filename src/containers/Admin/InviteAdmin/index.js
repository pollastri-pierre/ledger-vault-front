// @flow

import React, { PureComponent } from "react";

import InviteMember from "containers/InviteMember";

type Props = {
  close: () => void
};

class InviteAdmin extends PureComponent<Props> {
  render() {
    const { close } = this.props;

    return <InviteMember close={close} memberRole="admin" />;
  }
}

export default InviteAdmin;
