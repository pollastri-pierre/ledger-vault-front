// @flow

import React, { Component } from "react";
import { translate } from "react-i18next";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withRouter, Redirect } from "react-router";

import connectData from "restlay/connectData";
import OperationWithAccountQuery from "api/queries/OperationWithAccountQuery";
import UsersQuery from "api/queries/UsersQuery";
import ProfileQuery from "api/queries/ProfileQuery";

import Footer from "components/approve/Footer";
import ApprovalPercentage from "components/ApprovalPercentage";
import ModalLoading from "components/ModalLoading";
import { ModalBody, ModalHeader, ModalTitle } from "components/base/Modal";

import type { Account, Operation, Member, Translate } from "data/types";

import OperationApproveApprovals from "./OperationApproveApprovals";
import OperationApproveDetails from "./OperationApproveDetails";

type Props = {
  operationWithAccount: {
    account: Account,
    operation: Operation
  },
  users: Array<Member>,
  profile: Member,
  close: Function,
  approve: Function,
  aborting: Function,
  t: Translate
};

class OperationApprove extends Component<Props, { value: number }> {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      operationWithAccount: { account, operation },
      profile,
      users,
      close,
      approve,
      t,
      aborting
    } = this.props;

    const { value } = this.state;

    const approvers = [];

    account.members.forEach(approver => {
      const user = users.find(u => u.pub_key === approver);
      if (user) {
        approvers.push(user);
      }
    });

    const quorum = account.security_scheme.quorum;

    const hasApproved = (approvers, profile) =>
      approvers.find(approver => approver.person.pub_key === profile.pub_key);

    const GenericFooter = ({ percentage }: { percentage?: boolean }) => (
      <Footer
        close={close}
        approve={() => approve(operation)}
        aborting={aborting}
        approved={hasApproved(operation.approvals, profile)}
        percentage={
          percentage && (
            <ApprovalPercentage
              approvers={approvers}
              approved={operation.approvals}
              nbRequired={quorum}
            />
          )
        }
      />
    );

    return (
      <ModalBody height={615}>
        <ModalHeader>
          <ModalTitle>Operation request</ModalTitle>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
          >
            <Tab label={t("pendingOperation:tabs.details")} disableRipple />
            <Tab label={t("pendingOperation:tabs.status")} disableRipple />
          </Tabs>
        </ModalHeader>

        {value === 0 && (
          <div className="tabs_panel">
            <OperationApproveDetails operation={operation} account={account} />
            <GenericFooter />
          </div>
        )}
        {value === 1 && (
          <div>
            <OperationApproveApprovals
              members={users}
              operation={operation}
              account={account}
            />
            <GenericFooter percentage />
          </div>
        )}
      </ModalBody>
    );
  }
}

const RenderError = withRouter(({ match }) => (
  <Redirect to={`${match.params["0"] || ""}`} />
));

export default withRouter(
  connectData(translate()(OperationApprove), {
    RenderError,
    RenderLoading: ModalLoading,
    queries: {
      operationWithAccount: OperationWithAccountQuery,
      users: UsersQuery,
      profile: ProfileQuery
    },
    propsToQueryParams: props => ({
      operationId: props.match.params.id || ""
    })
  })
);
