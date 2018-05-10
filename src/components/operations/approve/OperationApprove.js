//@flow
import React, { Component } from "react";
import Footer from "../../approve/Footer";
import { withStyles } from "material-ui/styles";
import OperationApproveDedails from "./OperationApproveDedails";
import OperationApproveApprovals from "./OperationApproveApprovals";
import ApprovalPercentage from "components/ApprovalPercentage";
// import OperationApproveLocks from "./OperationApproveLocks";
import ModalLoading from "components/ModalLoading";
import { withRouter, Redirect } from "react-router";
import connectData from "restlay/connectData";
import OperationWithAccountQuery from "api/queries/OperationWithAccountQuery";
import MembersQuery from "api/queries/MembersQuery";
// import LocksPercentage from "../../LocksPercentage";
import ProfileQuery from "api/queries/ProfileQuery";
// import { calculateApprovingObjectMeta } from "data/approvingObject";
import type { Account, Operation, Member } from "data/types";
import Tabs, { Tab } from "material-ui/Tabs";
import modals from "shared/modals";

const styles = {
  base: {
    ...modals.base,
    width: "440px",
    height: "615px"
  }
};

type Props = {
  operationWithAccount: {
    account: Account,
    operation: Operation
  },
  members: Array<Member>,
  profile: Member,
  close: Function,
  approve: Function,
  aborting: Function,
  classes: { [_: $Keys<typeof styles>]: string },
  match: *
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
      members,
      close,
      approve,
      classes,
      aborting
    } = this.props;

    const approvers = [];
    account.members.forEach(approver => {
      const member = members.find(m => m.pub_key === approver);
      if (member) {
        approvers.push(member);
      }
    });

    const quorum = account.security_scheme.quorum;
    // const isUnactive =
    //   operation.approvals.length < account.security_scheme.quorum;
    // const approvingObjectMeta = calculateApprovingObjectMeta(operation);

    const { value } = this.state;

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
      <div className={classes.base}>
        <header>
          <h2>Operation request</h2>
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Details" disableRipple />
            <Tab label="Approvals" disableRipple />
            {/* <Tab label="Locks" disableRipple /> */}
          </Tabs>
        </header>
        {value === 0 && (
          <div className="tabs_panel">
            <OperationApproveDedails
              operation={operation}
              account={account}
              profile={profile}
            />
            <GenericFooter />
          </div>
        )}
        {value === 1 && (
          <div>
            <OperationApproveApprovals
              members={members}
              operation={operation}
              account={account}
            />
            <GenericFooter percentage />
          </div>
        )}
        {/* {value === 2 && ( */}
        {/*   <div> */}
        {/*     <OperationApproveLocks operation={operation} account={account} /> */}
        {/*     <Footer */}
        {/*       close={close} */}
        {/*       approve={() => approve(operation)} */}
        {/*       aborting={aborting} */}
        {/*       approved={hasApproved(operation.approvals, profile)} */}
        {/*       percentage={ */}
        {/*         isUnactive || !approvingObjectMeta ? ( */}
        {/*           <LocksPercentage /> */}
        {/*         ) : ( */}
        {/*           <LocksPercentage */}
        {/*             percentage={approvingObjectMeta.globalPercentage} */}
        {/*           /> */}
        {/*         ) */}
        {/*       } */}
        {/*     /> */}
        {/*   </div> */}
        {/* )} */}
      </div>
    );
  }
}

const RenderError = () => {
  return <Redirect to="/pending" />;
};

export default withRouter(
  connectData(withStyles(styles)(OperationApprove), {
    RenderError,
    RenderLoading: ModalLoading,
    queries: {
      operationWithAccount: OperationWithAccountQuery,
      members: MembersQuery,
      profile: ProfileQuery
    },
    propsToQueryParams: props => ({
      operationId: props.match.params.id || ""
    })
  })
);
