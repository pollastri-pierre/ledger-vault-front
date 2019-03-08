// @flow

import React, { PureComponent } from "react";

import InviteUser from "containers/InviteUser";

type Props = {
  close: () => void
};

class InviteAdmin extends PureComponent<Props> {
  render() {
    const { close } = this.props;

    return <InviteUser close={close} memberRole="admin" />;
  }
}

export default InviteAdmin;
