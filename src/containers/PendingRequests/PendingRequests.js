import React, { Component } from 'react';
import _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { openAccountApprove } from '../../redux/modules/account-approve';
import { getPendingRequests } from '../../redux/modules/pending-requests';
import { PendingAccountApprove } from '../../components';

import './PendingRequests.css';

const mapStateToProps = state => ({
  pendingRequests: state.pendingRequests,
});

const mapDispatchToProps = dispatch => ({
  onGetPendingRequests: () => dispatch(getPendingRequests()),
  onOpenAccountApprove: (idAccount, isApproved) => dispatch(openAccountApprove(idAccount, isApproved)),
});

class PendingRequests extends Component {
  componentWillMount() {
    const { onGetPendingRequests, pendingRequests } = this.props;

    if (_.isNull(pendingRequests.data) && !pendingRequests.isLoading) {
      onGetPendingRequests();
    }
  }

  render() {
    const { pendingRequests, onOpenAccountApprove } = this.props;

    return (
      <div className="pending-requests">
        <div className="pending-left">
          <div className="bloc">
            <h3>Operations to approve</h3>
            {pendingRequests.isLoading || _.isNull(pendingRequests.data) ?
              <CircularProgress
                size={30}
                style={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
              :
              <p>There are no operations to approve</p>
            }
          </div>
          <div className="bloc">
            <h3>Operations to watch</h3>
            {pendingRequests.isLoading || _.isNull(pendingRequests.data) ?
              <CircularProgress
                size={30}
                style={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
              :
              <p>There are no operations to watch</p>
            }
          </div>
        </div>
        <div className="pending-right">
          <div className="bloc">
            <h3>Accounts to approve</h3>
            {pendingRequests.isLoading || _.isNull(pendingRequests.data) ?
              <CircularProgress
                size={30}
                style={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
              :
              <PendingAccountApprove
                accounts={pendingRequests.data.approveAccounts}
                open={onOpenAccountApprove}
              />
            }
          </div>
          <div className="bloc">
            <h3>Accounts to watch</h3>
            {pendingRequests.isLoading || _.isNull(pendingRequests.data) ?
              <CircularProgress
                size={30}
                style={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-15px',
                }}
              />
              :
              <PendingAccountApprove
                accounts={pendingRequests.data.watchAccounts}
                open={onOpenAccountApprove}
                approved
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

PendingRequests.propTypes = {
  onGetPendingRequests: PropTypes.func.isRequired,
  onOpenAccountApprove: PropTypes.func.isRequired,
  pendingRequests: PropTypes.shape({}).isRequired,
};

export { PendingRequests as PendingRequestNotDecorated };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PendingRequests));
