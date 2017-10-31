import React, { Component } from "react";
import _ from "lodash";
import CircularProgress from "material-ui/CircularProgress";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { openApprove } from "../../redux/modules/entity-approve";
import { getPendingRequests } from "../../redux/modules/pending-requests";
import { getOrganizationApprovers } from "../../redux/modules/organization";
import { getAccounts } from "../../redux/modules/accounts";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import {
  PendingAccountApprove,
  PendingOperationApprove
} from "../../components";

import "./PendingRequests.css";

// const mapStateToProps = state => ({
//   pendingRequests: state.pendingRequests,
//   organization: state.organization,
//   accounts: state.accounts,
//   profile: state.profile
// });
//
// const mapDispatchToProps = dispatch => ({
//   onGetPendingRequests: () => dispatch(getPendingRequests()),
//   onGetAccounts: () => dispatch(getAccounts()),
//   onOpenApprove: (entity, object, isApproved) =>
//     dispatch(openApprove(entity, object, isApproved)),
//   onGetOrganizationApprovers: () => dispatch(getOrganizationApprovers())
// });

class PendingRequests extends Component {
  render() {
    const { accounts, pendingRequests, approversAccount } = this.props;

    console.log(this.props);

    const profile = {
      user: {
        hash: "efew"
      }
    };

    return (
      <div className="pending-requests">
        <div className="pending-left">
          <div className="bloc">
            <h3>Operations to approve</h3>
            <PendingOperationApprove
              operations={pendingRequests.approveOperations}
              accounts={accounts}
              user={profile.user}
            />
          </div>
          <div className="bloc">
            <h3>Operations to watch</h3>
            <PendingOperationApprove
              operations={pendingRequests.watchOperations}
              approved
              user={profile.user}
              accounts={accounts}
            />
          </div>
        </div>
        <div className="pending-right">
          <div className="bloc">
            <h3>Accounts to approve</h3>
            <PendingAccountApprove
              accounts={pendingRequests.approveAccounts}
              approvers={approversAccount}
              user={profile.user}
            />
          </div>
          <div className="bloc">
            <h3>Accounts to watch</h3>
            <PendingAccountApprove
              accounts={pendingRequests.watchAccounts}
              approvers={approversAccount}
              user={profile.user}
              approved
            />
          </div>
        </div>
      </div>
    );
  }
}

PendingRequests.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pendingRequests: PropTypes.shape({}).isRequired
};

export { PendingRequests as PendingRequestNotDecorated };

export default connectData(PendingRequests, {
  api: {
    pendingRequests: api.pendings,
    accounts: api.accounts,
    approversAccount: api.approvers
  }
});
