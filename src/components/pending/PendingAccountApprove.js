import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ValidateBadge from '../icons/ValidateBadge';
import { formatDate } from '../../redux/utils/format';

function PendingAccountApprove(props) {
  const { accounts, open, approved } = props;
  if (accounts.length === 0) {
    return (
      <p>There are no accounts to approve</p>
    );
  }

  const nbCurrencies = _.size(
    _.groupBy(accounts, account => { return account.currency.family; })
  );

  return (
    <div className="pending-request-list">
      {!approved &&
        <div>
          <p className="header dark">
            { accounts.length === 1 ?
              <span>1 account</span>
              :
              <span>{accounts.length} accounts</span>
            }
            <span>{nbCurrencies}</span>
          </p>
          <p className="header light">
            <span>pending approval</span>
            { nbCurrencies === 1 ?
              <span>currency</span>
              :
              <span>currencies</span>
            }
          </p>
        </div>
      }
      {_.map(accounts, (account) => {
        const currencyClass = account.currency.family.toLowerCase();
        const { security_scheme } = account;
        return (
          <div
            className={`pending-request ${approved ? 'watch' : ''}`}
            key={account.id}
            onClick={() => open(account.id, approved)}
          >
            <div>
              <span className="request-date-creation">{formatDate(account.creation_time, 'lll')}</span>
              <span className={`request-name ${currencyClass}`}>{account.name}</span>
            </div>
            <div>
              <span className={`request-approval-state ${approved ? 'approved' : ''}`}>
                {approved && 
                  <ValidateBadge className="confirmed" />
                }

                {approved ?
                  'Approved'
                  :
                  'Collecting Approvals'
                }
                {` (${security_scheme.approvers.length}/${security_scheme.quorum} ) `}
              </span>
              <span className="request-currency">{account.currency.family}</span>
            </div>
          </div>
       );
      })}
    </div>
  );
}

PendingAccountApprove.defaultTypes = {
  approved: false,
};

PendingAccountApprove.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  open: PropTypes.func.isRequired,
  approved: PropTypes.bool,
};

export default PendingAccountApprove;
