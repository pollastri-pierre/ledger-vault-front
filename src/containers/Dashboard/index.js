import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import { setTotalBalanceFilter } from '../../redux/modules/dashboard';
import TotalBalanceFilter from '../../components/TotalBalanceFilter';
import TotalBalance from '../../components/TotalBalance';

import './index.css';

// Replace these with imports
const Currencies = () => <div>TODO</div>; // FIXME @malik replace with your component import
const PendingPreview = () => <div>TODO</div>;
const LastOperationPreview = () => <div>TODO</div>;
const StoragePreview = () => <div>TODO</div>;

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
    const storages = [
      { id: 0, title: 'cold storage' },
      { id: 1, title: 'cold storage' },
      { id: 2, title: 'trackerfund' },
      { id: 3, title: 'hot wallet' },
      { id: 4, title: 'etf holdings' }
    ];
    return (
      <div id="dashboard">
        <div className="body">
          <Card
            title="total balance"
            titleRight={
              <TotalBalanceFilter
                value={dashboard.totalBalanceFilter}
                onChange={onTotalBalanceFilterChange}
              />
            }
          >
            <TotalBalance
              totalBalance={dashboard.totalBalance}
              totalBalanceFilter={dashboard.totalBalanceFilter}
            />
          </Card>
          <Card title="pending" titleRight={<LastOperationViewAll />}>
            <LastOperationPreview />
          </Card>
          <div className="storages">
            {storages.map(storage => (
              <Card key={storage.id} title={storage.title}>
                <StoragePreview storage={storage} />
              </Card>
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
