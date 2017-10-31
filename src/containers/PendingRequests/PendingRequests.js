import React, { Component } from "react";
import _ from "lodash";
import CircularProgress from "material-ui/CircularProgress";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { openAccountApprove } from "../../redux/modules/account-approve";
import { getPendingRequests } from "../../redux/modules/pending-requests";
import { getOrganizationApprovers } from "../../redux/modules/organization";
import { PendingAccountApprove } from "../../components";

import "./PendingRequests.css";

const mapStateToProps = state => ({
  pendingRequests: state.pendingRequests,
  organization: state.organization
});

const mapDispatchToProps = dispatch => ({
  onGetPendingRequests: () => dispatch(getPendingRequests()),
  onOpenAccountApprove: (idAccount, isApproved) =>
    dispatch(openAccountApprove(idAccount, isApproved)),
  onGetOrganizationApprovers: () => dispatch(getOrganizationApprovers())
});

class PendingRequests extends Component {
  componentWillMount() {
    const {
      onGetOrganizationApprovers,
      onGetPendingRequests,
      pendingRequests,
      organization
    } = this.props;

    if (_.isNull(pendingRequests.data) && !pendingRequests.isLoading) {
      onGetPendingRequests();
    }

    if (_.isNull(organization.approvers) && !organization.isLoadingApprovers) {
      onGetOrganizationApprovers();
    }
  }

  render() {
    const { pendingRequests, onOpenAccountApprove, organization } = this.props;

    return (
      <div className="pending-requests">
        <div className="pending-left">
          <div className="bloc">
            <h3>Operations to approve</h3>
            {pendingRequests.isLoading || _.isNull(pendingRequests.data) ? (
              <CircularProgress
                size={30}
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-15px"
                }}
              />
            ) : (
              <p>There are no operations to approve</p>
            )}
          </div>
          <div className="bloc">
            <h3>Operations to watch</h3>
            {pendingRequests.isLoading || _.isNull(pendingRequests.data) ? (
              <CircularProgress
                size={30}
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-15px"
                }}
              />
            ) : (
              <p>There are no operations to watch</p>
            )}
          </div>
        </div>
        <div className="pending-right">
          <div className="bloc">
            <h3>Accounts to approve</h3>
            {pendingRequests.isLoading ||
            _.isNull(pendingRequests.data) ||
            _.isNull(organization.approvers) ||
            _.isNull(organization.isLoadingApprovers) ? (
              <CircularProgress
                size={30}
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-15px"
                }}
              />
            ) : (
              <PendingAccountApprove
                accounts={pendingRequests.data.approveAccounts}
                approvers={organization.approvers}
                open={onOpenAccountApprove}
              />
            )}
          </div>
          <div className="bloc">
            <h3>Accounts to watch</h3>
            {pendingRequests.isLoading ||
            _.isNull(pendingRequests.data) ||
            _.isNull(organization.approvers) ||
            _.isNull(organization.isLoadingApprovers) ? (
              <CircularProgress
                size={30}
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-15px"
                }}
              />
            ) : (
              <PendingAccountApprove
                accounts={pendingRequests.data.watchAccounts}
                approvers={organization.approvers}
                open={onOpenAccountApprove}
                approved
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

PendingRequests.propTypes = {
  onGetPendingRequests: PropTypes.func.isRequired,
  onOpenAccountApprove: PropTypes.func.isRequired,
  pendingRequests: PropTypes.shape({}).isRequired
};

export { PendingRequests as PendingRequestNotDecorated };

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PendingRequests)
);
