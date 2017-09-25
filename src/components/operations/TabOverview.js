import React from 'react';

const getConfirmation = n => {
  if (n > 0) {
    return `Confirmed (${n})`;
  } else {
    return 'Unconfirmed';
  }
};

function TabOverview(props) {
  const { operation } = props;
  return (
    <div>
      <div className="operation-overview-header">
        <div className="operation-overview-amount">
          <p className="crypto-amount">-BTC 0.88962</p>
          <span className="arrow-grey-down"></span>
          <p className="euro-amount">EUR 1,028.93</p>
          <p className="hash">1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX</p>
        </div>
      </div>
      <table className="operation-list">
        <tbody>
          <tr>
            <td>STATUS</td>
            <td>
              <strong>{getConfirmation(operation.confirmations)}</strong>
              {(operation.confirmations > 0) ?
                <span className="confirmed operation-status" />
                : false}
            </td>
          </tr>
          <tr>
            <td>SEND DATE</td>
            <td>Mon, 7th Mar, 2:34 AM</td>
          </tr>
          <tr>
            <td>ACCOUNT</td>
            <td>Cold wallet {operation.account_id}</td>
          </tr>
          <tr>
            <td>Fees</td>
            <td>BTC 0.0015 <span className="euro-amount">(EUR 0.25)</span></td>
          </tr>
          <tr>
            <td>TOTAL SPENT</td>
            <td><strong>BTC 0.0015</strong> <span className="euro-amount">(EUR 0.25)</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TabOverview;
