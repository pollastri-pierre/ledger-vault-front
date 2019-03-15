// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import DialogButton from "components/buttons/DialogButton";

type Props = {
  status: string,
};

class UserDetailsFooter extends PureComponent<Props> {
  editUser = () => {
    console.warn("TODO: edit member");
  };

  revokeUser = () => {
    console.warn("TODO: revoke member");
  };

  approveUser = () => {
    console.warn("TODO: approve member");
  };

  render() {
    const { status } = this.props;
    return (
      <Box pb={10} justify="flex-end" horizontal>
        {status === "PENDING_INVITATION" && (
          <DialogButton highlight onTouchTap={this.editUser}>
            <Trans i18nKey="common:edit" />
          </DialogButton>
        )}
        {(status === "PENDING_APPROVAL" || status === "PENDING_REVOCATION") && (
          <Box horizontal flow={10}>
            <DialogButton highlight onTouchTap={this.revokeUser}>
              <Trans i18nKey="common:revoke" />
            </DialogButton>
            <DialogButton onTouchTap={this.approveUser}>
              <Trans i18nKey="common:approve" />
            </DialogButton>
          </Box>
        )}
        {status === "ACTIVE" && (
          <DialogButton highlight onTouchTap={this.revokeUser}>
            <Trans i18nKey="common:revoke" />
          </DialogButton>
        )}
      </Box>
    );
  }
}

export default UserDetailsFooter;
