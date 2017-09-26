import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ListOperation } from '../../components';
import { openOperationModal } from '../../redux/modules/operations';
import { getReceiveAddress, getBalance, getCountervalue } from '../../redux/modules/accounts-info';
import { getFakeList } from '../../redux/utils/operation';
import BalanceCard from './BalanceCard';
import CounterValueCard from './CounterValueCard';
import ReceiveFundsCard from './ReceiveFundsCard';
import Quicklook from './Quicklook';
import './Account.css';


const mapStateToProps = state => ({
  operations: state.operations,
  accounts: state.accounts,
  accountsInfo: state.accountsInfo,
});

const mapDispatchToProps = dispatch => ({
  onGetOperation: (id, index) => dispatch(openOperationModal(id, index)),
  onGetBalance: id => dispatch(getBalance(id)),
  onGetReceiveAddress: id => dispatch(getReceiveAddress(id)),
  onGetCountervalue: id => dispatch(getCountervalue(id)),
});

class AccountView extends Component {

  componentWillMount() {
    this.props.onGetBalance(this.props.match.params.id)
    this.props.onGetReceiveAddress(this.props.match.params.id)
    this.props.onGetCountervalue(this.props.match.params.id)
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.onGetBalance(nextProps.match.params.id)
      this.props.onGetReceiveAddress(nextProps.match.params.id)
      this.props.onGetCountervalue(nextProps.match.params.id)
    }
  }

  render() {
    const { balance, countervalue, receiveAddress, isLoadingBalance, isLoadingCounter, isLoadingAddress } = this.props.accountsInfo;

    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <BalanceCard data={ balance } loading={ isLoadingBalance } />
              <CounterValueCard data={ countervalue } loading={ isLoadingCounter }/>
            </div>
            <ReceiveFundsCard data={receiveAddress} loading={ isLoadingAddress }/>.
          </div>
          <Quicklook />
        </div>
        <ListOperation operations={ getFakeList() } open={ this.props.onGetOperation } />
      </div>
    );
  }

}

AccountView.propTypes = {
  operations: PropTypes.shape({}),
};

export { AccountView };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountView));

