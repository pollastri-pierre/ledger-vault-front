// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Button from "@material-ui/core/Button";
import Box from "components/base/Box";

type Props = {
  status: string
};

class MemberDetailsFooter extends PureComponent<Props> {
  editMember = () => {
    console.warn("TODO: edit member");
  };

  revokeMember = () => {
    console.warn("TODO: revoke member");
  };

  approveMember = () => {
    console.warn("TODO: approve member");
  };

  render() {
    const { status } = this.props;
    return (
      <Box pb={10} justify="flex-end" horizontal>
        {status === "PENDING_INVITATION" && (
          <Button color="primary" onClick={this.editMember}>
            <Trans i18nKey="common:edit" />
          </Button>
        )}
        {(status === "PENDING_APPROVAL" || status === "PENDING_REVOCATION") && (
          <Box horizontal>
            <Button color="secondary" onClick={this.revokeMember}>
              <Trans i18nKey="common:revoke" />
            </Button>
            <Button color="primary" onClick={this.approveMember}>
              <Trans i18nKey="common:approve" />
            </Button>
          </Box>
        )}
        {status === "ACTIVE" && (
          <Button color="secondary" onClick={this.revokeMember}>
            <Trans i18nKey="common:revoke" />
          </Button>
        )}
      </Box>
    );
  }
}

export default MemberDetailsFooter;
