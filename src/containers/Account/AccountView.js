import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { ListOperation, CardLoading } from '../../components';
import { openOperationModal } from '../../redux/modules/operations';
import { getBalance } from '../../redux/modules/accounts';
import { getFakeList } from '../../redux/utils/operation';
import BalanceCard from './BalanceCard';
import CounterValueCard from './CounterValueCard';
import ReceiveFundsCard from './ReceiveFundsCard';
import Quicklook from './Quicklook';
import './Account.css';
import CardLoader from '../../decorators/CardLoader';


const mapStateToProps = state => ({
  operations: state.operations,
  accounts: state.accounts,
});

const mapDispatchToProps = dispatch => ({
  onGetOperation: (id, index) => dispatch(openOperationModal(id, index)),
});


const test = {
  date: 'Today, 4pm',
  value: 'ETH 0.99923',
};

const ctv = {
  amount: 55.45,
  countervalue: '18.989',
};


function AccountView(props) {
  console.log("here");
  const Balance = CardLoader(BalanceCard, test, props.onGetBalance, false);
  const Countervalue = CardLoader(CounterValueCard, ctv, props.onGetBalance, false);

  return (
    <div className="account-view">
      <div className="account-view-infos">
        <div className="infos-left">
          <div className="infos-left-top">

            <Balance className="bloc balance" />
            <Countervalue className="bloc countervalue" />
          </div>
          <ReceiveFundsCard hash="fewfwfwefwekj8f23fkjklj123Hfedfsdf"/>
        </div>
        <Quicklook />
      </div>
      <ListOperation operations={ getFakeList() } open={ props.onGetOperation } />

    </div>
  );
}

AccountView.propTypes = {
  operations: PropTypes.shape({}),
};

export { AccountView };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountView));

