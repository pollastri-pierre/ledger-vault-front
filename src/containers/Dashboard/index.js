import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAccounts } from '../../redux/modules/accounts';

//Containers
import Section from './Section';
import Currencies from './Currencies';

//STYLES 
import './index.css';

// Replace these with imports
//const Currencies = () => <div>TODO</div>; // FIXME @malik replace with your component import
const PendingPreview = () => <div>TODO</div>;
const TotalBalance = () => <div>TODO</div>;
const LastOperationPreview = () => <div>TODO</div>;
const StoragePreview = () => <div>TODO</div>;

const PendingViewAll = () => <Link to="TODO">VIEW ALL (7)</Link>;
const LastOperationViewAll = () => <Link to="TODO">VIEW ALL</Link>;
const TotalBalanceFilter = () => <span>YERSTERDAY</span>;



const mapStateToProps = state => ({
  accounts: state.accounts,
  accountsInfo: state.accountsInfo,
});

const mapDispatchToProps = dispatch => ({
  onGetAccounts: id => dispatch(getAccounts()),
});


class Dashboard extends Component {

  componentWillMount() {
    this.update(this.props);
  }

  update(props) {
    this.props.onGetAccounts();
  }


  render() {
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

    console.log(isLoadingAccounts);
    console.log(accounts);

    return (
      <div id="dashboard">
        <div className="body">
          <Section title="total balance" titleRight={<TotalBalanceFilter />}>
            <TotalBalance />
          </Section>
          <Section title="pending" titleRight={<LastOperationViewAll />}>
            <LastOperationPreview />
          </Section>
          <div className="storages">
            {storages.map(storage => (
              <Section key={storage.id} title={storage.title}>
                <StoragePreview storage={storage} />
              </Section>
            ))}
          </div>
        </div>
        <div className="aside">
          <Currencies accounts={accounts} loading={isLoadingAccounts}/>
        </div>
      </div>
    );
  }
}

export { Dashboard as DashboardNotDecorated };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));