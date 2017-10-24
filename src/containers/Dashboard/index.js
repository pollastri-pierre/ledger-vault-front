import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import { setTotalBalanceFilter } from '../../redux/modules/dashboard';
import TotalBalanceCard from './TotalBalanceCard';
import AccountCard from './AccountCard';

import './index.css';

// Replace these with imports
const Currencies = () => <div>TODO</div>; // FIXME @malik replace with your component import
const PendingPreview = () => <div>TODO</div>;
const LastOperationPreview = () => <div>TODO</div>;

const PendingViewAll = () => <Link to="TODO">VIEW ALL (7)</Link>;
const LastOperationViewAll = () => <Link to="TODO">VIEW ALL</Link>;

const mapStateToProps = ({ dashboard }) => ({ dashboard });

const mapDispatchToProps = dispatch => ({
  onTotalBalanceFilterChange: totalBalanceFilter =>
    dispatch(setTotalBalanceFilter(totalBalanceFilter))
});

class Dashboard extends Component {
  render() {
    const { dashboard, onTotalBalanceFilterChange } = this.props;
    return (
      <div id="dashboard">
        <div className="body">
          <TotalBalanceCard
            dashboard={dashboard}
            onTotalBalanceFilterChange={onTotalBalanceFilterChange}
          />
          <Card title="pending" titleRight={<LastOperationViewAll />}>
            <LastOperationPreview />
          </Card>
          <div className="storages">
            {dashboard.accounts.map(a => (
              <AccountCard
                key={a.id}
                account={a}
                filter={dashboard.totalBalanceFilter}
              />
            ))}
          </div>
        </div>
        <div className="aside">
          <Card title="currencies">
            <Currencies />
          </Card>
          <Card title="pending" titleRight={<PendingViewAll />}>
            <PendingPreview />
          </Card>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
