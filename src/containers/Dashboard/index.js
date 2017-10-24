import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAccounts } from '../../redux/modules/accounts';

//Components
import Card from '../../components/Card';

//Containers
import Currencies from './Currencies';

import { setTotalBalanceFilter } from '../../redux/modules/dashboard';
import TotalBalanceFilter from '../../components/TotalBalanceFilter';
import TotalBalance from '../../components/TotalBalance';

//STYLES 
import './index.css';

// Replace these with imports
//const Currencies = () => <div>TODO</div>; // FIXME @malik replace with your component import
const PendingPreview = () => <div>TODO</div>;
const LastOperationPreview = () => <div>TODO</div>;
const StoragePreview = () => <div>TODO</div>;

const PendingViewAll = () => <Link to="TODO">VIEW ALL (7)</Link>;
const LastOperationViewAll = () => <Link to="TODO">VIEW ALL</Link>;

//const mapStateToProps = ({ dashboard }) => ({ dashboard });

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

    console.log(this.props);

    const storages = [
      { id: 0, title: 'cold storage' },
      { id: 1, title: 'cold storage' },
      { id: 2, title: 'trackerfund' },
      { id: 3, title: 'hot wallet' },
      { id: 4, title: 'etf holdings' }
    ];


    const {
      isLoadingAccounts,
      accounts,
    } = this.props.accounts;

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
            <Currencies accounts={accounts} loading={isLoadingAccounts}/>
          </Card>
          <Card title="pending" titleRight={<PendingViewAll />}>
            <PendingPreview />
          </Card>
        </div>
      </div>
    );
  }
}

export { Dashboard as DashboardNotDecorated };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
