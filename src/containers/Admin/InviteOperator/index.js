// @flow

import React, { PureComponent } from "react";

import InviteUser from "containers/InviteUser";

type Props = {
  close: () => void
};

class InviteOperator extends PureComponent<Props> {
  render() {
    const { close } = this.props;

    return <InviteUser close={close} userRole="operator" />;
  }
}

export default InviteOperator;
