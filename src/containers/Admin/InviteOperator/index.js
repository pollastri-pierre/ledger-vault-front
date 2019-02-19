// @flow

import React, { PureComponent } from "react";

import InviteMember from "containers/InviteMember";

type Props = {
  close: () => void
};

class InviteOperator extends PureComponent<Props> {
  render() {
    const { close } = this.props;

    return <InviteMember close={close} memberRole="operator" />;
  }
}

export default InviteOperator;
