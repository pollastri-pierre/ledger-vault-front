import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import './index.css';

// Replace these with imports
const Currencies = () => <div>TODO</div>; // FIXME @malik replace with your component import
const PendingPreview = () => <div>TODO</div>;
const TotalBalance = () => <div>TODO</div>;
const LastOperationPreview = () => <div>TODO</div>;
const StoragePreview = () => <div>TODO</div>;

const PendingViewAll = () => <Link to="TODO">VIEW ALL (7)</Link>;
const LastOperationViewAll = () => <Link to="TODO">VIEW ALL</Link>;
const TotalBalanceFilter = () => <span>YERSTERDAY</span>;

class Dashboard extends Component {
  render() {
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
          <Section title="currencies">
            <Currencies />
          </Section>
          <Section title="pending" titleRight={<PendingViewAll />}>
            <PendingPreview />
          </Section>
        </div>
      </div>
    );
  }
}

export default Dashboard;
