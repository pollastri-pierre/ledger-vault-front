import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ListOperation } from '../../components';
import { openOperationModal } from '../../redux/modules/operations';
import { getReceiveAddress, getBalance, getCountervalue, getOperations } from '../../redux/modules/accounts-info';
import BalanceCard from './BalanceCard';
import CounterValueCard from './CounterValueCard';
import ReceiveFundsCard from './ReceiveFundsCard';
import Quicklook from './Quicklook';
import './Account.css';

const mapStateToProps = state => ({
  accounts: state.accounts,
  accountsInfo: state.accountsInfo,
});

const mapDispatchToProps = dispatch => ({
  onGetOperation: (id, index) => dispatch(openOperationModal(id, index)),
  onGetOperations: (id, index) => dispatch(getOperations(id, index)),
  onGetBalance: id => dispatch(getBalance(id)),
  onGetReceiveAddress: id => dispatch(getReceiveAddress(id)),
  onGetCountervalue: id => dispatch(getCountervalue(id)),
});

class AccountView extends Component {
  componentWillMount() {
    this.update(this.props);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.update(nextProps);
    }
  }

  update(props) {
    this.props.onGetBalance(props.match.params.id);
    this.props.onGetReceiveAddress(props.match.params.id);
    this.props.onGetCountervalue(props.match.params.id);
    this.props.onGetOperations(props.match.params.id, 0);
  }

  render() {
    const {
      balance,
      countervalue,
      receiveAddress,
      operations,
      isLoadingBalance,
      isLoadingCounter,
      isLoadingAddress,
      isLoadingOperations,
      isLoadingNextOperations,
    } = this.props.accountsInfo;

    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <BalanceCard data={balance} loading={isLoadingBalance} />
              <CounterValueCard data={countervalue} loading={isLoadingCounter} />
            </div>
            <ReceiveFundsCard data={receiveAddress} loading={isLoadingAddress} />
          </div>
          <Quicklook
            operations={operations}
            loading={isLoadingOperations || isLoadingNextOperations}
          />
        </div>
        <ListOperation
          columnIds={['date', 'adress', 'status', 'amount']}
          operations={operations}
          loading={isLoadingOperations}
          open={this.props.onGetOperation}
        />
      </div>
    );
  }
}

AccountView.propTypes = {
  onGetBalance: PropTypes.func.isRequired,
  onGetReceiveAddress: PropTypes.func.isRequired,
  onGetCountervalue: PropTypes.func.isRequired,
  onGetOperations: PropTypes.func.isRequired,
  onGetOperation: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  accountsInfo: PropTypes.shape({
    balance: PropTypes.shape({}),
    countervalue: PropTypes.shape({}),
    receiveAddress: PropTypes.shape({}),
    operations: PropTypes.array,
    isLoadingCounter: PropTypes.bool.isRequired,
    isLoadingAddress: PropTypes.bool.isRequired,
    isLoadingBalance: PropTypes.bool.isRequired,
    isLoadingOperations: PropTypes.bool.isRequired,
    isLoadingNextOperations: PropTypes.bool.isRequired,
  }).isRequired,
};

export { AccountView as AccountViewNotDecorated };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountView));

