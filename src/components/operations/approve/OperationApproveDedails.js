import React from 'react';
import ArrowDown from '../../icons/ArrowDown';
import PropTypes from 'prop-types';

function OperationApproveDetails(props) {
  const {operation} = props;

  return (
    <div className="operation-details">
      <div className="operation-overview-header">
        <div className="operation-overview-amount">
          <p className="crypto-amount">-BTC 0.88962</p>
          <span className="arrow-grey-down" />
          <ArrowDown className="arrow-grey-down" />
          <p className="euro-amount">EUR 1,028.93</p>
          <p className="hash">1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX</p>
        </div>
      </div>
      <table className="operation-list">
        <tbody>
          <tr>
            <td>STATUS</td>
            <td>Collecting Approvals</td>
          </tr>
          <tr>
            <td>REQUESTED</td>
            <td>Mon, 7th Mar, 2:34 AM</td>
          </tr>
          <tr>
            <td>ACCOUNT TO DEBIT</td>
            <td>Cold wallet {operation.account_id}</td>
          </tr>
          <tr>
            <td>Confirmation Fees</td>
            <td>
              BTC 0.0015 <span className="euro-amount">(EUR 0.25)</span>
            </td>
          </tr>
          <tr>
            <td>TOTAL SPENT</td>
            <td>
              <strong>BTC 0.0015</strong>{' '}
              <span className="euro-amount">(EUR 0.25)</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

OperationApproveDetails.propTypes = {
  operation: PropTypes.shape({}),
};

export default OperationApproveDetails;
