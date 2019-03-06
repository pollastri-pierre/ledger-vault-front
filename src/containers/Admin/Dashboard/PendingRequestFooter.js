// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import RequestApproveMutation from "api/mutations/RequestApproveMutation";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";
import DialogButton from "components/buttons/DialogButton";

type Props = {
  requestID: string,
  restlay: RestlayEnvironment,
  onClose: () => void
};

class AdminTasksFooter extends PureComponent<Props> {
  abort = () => {
    console.warn("TODO: revoke member");
  };

  approve = async () => {
    try {
      // TODO: add device interation flow part
      await this.props.restlay.commitMutation(
        new RequestApproveMutation({
          requestID: this.props.requestID
        })
      );
      await this.props.restlay.fetchQuery(new PendingRequestsQuery());
      this.props.onClose();
    } catch (error) {
      console.warn(error);
    }
  };

  render() {
    return (
      <Fragment>
        <DialogButton highlight onTouchTap={this.abort}>
          <Trans i18nKey="common:revoke" />
        </DialogButton>
        <DialogButton onTouchTap={this.approve}>
          <Trans i18nKey="common:approve" />
        </DialogButton>
      </Fragment>
    );
  }
}

export default connectData(AdminTasksFooter);
