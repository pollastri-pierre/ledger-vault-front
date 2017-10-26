import React, {Component} from 'react';
import _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {openApprove} from '../../redux/modules/entity-approve';
import {getPendingRequests} from '../../redux/modules/pending-requests';
import {getOrganizationApprovers} from '../../redux/modules/organization';
import {getAccounts} from '../../redux/modules/accounts';
import {PendingAccountApprove, PendingOperationApprove} from '../../components';

import './PendingRequests.css';

const mapStateToProps = state => ({
  pendingRequests: state.pendingRequests,
  organization: state.organization,
  accounts: state.accounts,
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  onGetPendingRequests: () => dispatch(getPendingRequests()),
  onGetAccounts: () => dispatch(getAccounts()),
  onOpenApprove: (entity, object, isApproved) =>
    dispatch(openApprove(entity, object, isApproved)),
  onGetOrganizationApprovers: () => dispatch(getOrganizationApprovers()),
});

class PendingRequests extends Component {
  componentWillMount() {
    const {
      onGetOrganizationApprovers,
      onGetPendingRequests,
      onGetAccounts,
      pendingRequests,
      accounts,
      organization,
    } = this.props;

    if (_.isNull(pendingRequests.data) && !pendingRequests.isLoading) {
      onGetPendingRequests();
    }

    if (_.isNull(organization.approvers) && !organization.isLoadingApprovers) {
      onGetOrganizationApprovers();
    }

    if (_.isNull(accounts.accounts) && !accounts.isLoadingAccounts) {
      onGetAccounts();
    }
  }

  render() {
    const {
      pendingRequests,
      profile,
      onOpenApprove,
      organization,
      accounts,
    } = this.props;

    return (
      <div className="pending-requests">
        <div className="pending-left">
          <div className="bloc">
            <h3>Operations to approve</h3>
            {pendingRequests.isLoading ||
            _.isNull(pendingRequests.data) ||
            _.isNull(accounts.accounts) ||
            accounts.isLoadingAccounts ? (
              <CircularProgress
                size={30}
                style={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
            ) : (
              <PendingOperationApprove
                operations={pendingRequests.data.approveOperations}
                accounts={accounts.accounts}
                user={profile.user}
                open={onOpenApprove}
              />
            )}
          </div>
          <div className="bloc">
            <h3>Operations to watch</h3>
            {pendingRequests.isLoading ||
            _.isNull(pendingRequests.data) ||
            accounts.isLoadingAccounts ||
            _.isNull(accounts.accounts) ? (
              <CircularProgress
                size={30}
                style={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
            ) : (
              <PendingOperationApprove
                operations={pendingRequests.data.watchOperations}
                approved
                user={profile.user}
                accounts={accounts.accounts}
                open={onOpenApprove}
              />
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
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
            ) : (
              <PendingAccountApprove
                accounts={pendingRequests.data.approveAccounts}
                approvers={organization.approvers}
                user={profile.user}
                open={onOpenApprove}
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
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
            ) : (
              <PendingAccountApprove
                accounts={pendingRequests.data.watchAccounts}
                approvers={organization.approvers}
                open={onOpenApprove}
                user={profile.user}
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
  onOpenApprove: PropTypes.func.isRequired,
  pendingRequests: PropTypes.shape({}).isRequired,
};

export {PendingRequests as PendingRequestNotDecorated};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PendingRequests),
);
