import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAccounts } from '../../redux/modules/accounts';
import _ from 'lodash';
import { SpinnerCard } from '../../components';

//Components
import Card from '../../components/Card';

//Containers
import Currencies from './Currencies';

import { setTotalBalanceFilter } from '../../redux/modules/dashboard';
import TotalBalanceCard from './TotalBalanceCard';
import AccountCard from './AccountCard';
import LastOperationCard from './LastOperationCard';
import PendingCard from './PendingCard';
import Storages from './Storages';

import './index.css';

const mapStateToProps = state => ({
  accounts: state.accounts,
  dashboard: state.dashboard
});

const mapDispatchToProps = dispatch => ({
  onGetAccounts: id => dispatch(getAccounts()),
  onTotalBalanceFilterChange: totalBalanceFilter =>
    dispatch(setTotalBalanceFilter(totalBalanceFilter))
});

class Dashboard extends Component {
  componentWillMount() {
    this.update(this.props);
  }

  update(props) {
    this.props.onGetAccounts();
  }

  render() {
    const { dashboard, onTotalBalanceFilterChange } = this.props;

    const storages = [
      { id: 0, title: 'cold storage' },
      { id: 1, title: 'cold storage' },
      { id: 2, title: 'trackerfund' },
      { id: 3, title: 'hot wallet' },
      { id: 4, title: 'etf holdings' }
    ];

    const { isLoadingAccounts, accounts } = this.props.accounts;

    return (
      <div id="dashboard">
        <div className="body">
          <TotalBalanceCard
            dashboard={dashboard}
            onTotalBalanceFilterChange={onTotalBalanceFilterChange}
          />
          {isLoadingAccounts ? (
            <Card title="last operations">
              <SpinnerCard />
            </Card>
          ) : (
            <LastOperationCard
              {...dashboard.lastOperations}
              accounts={accounts}
            />
          )}
          <Storages filter={dashboard.totalBalanceFilter} />
        </div>
        <div className="aside">
          <Card title="currencies">
            {isLoadingAccounts ? (
              <SpinnerCard />
            ) : (
              <Currencies accounts={accounts} loading={isLoadingAccounts} />
            )}
          </Card>
          <PendingCard {...dashboard.pending} />
        </div>
      </div>
    );
  }
}

export { Dashboard as DashboardNotDecorated };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
