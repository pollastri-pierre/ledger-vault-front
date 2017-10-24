import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ValidateBadge from '../icons/ValidateBadge';
import {formatDate} from '../../redux/utils/format';

function PendingOperationApprove(props) {
  const {operations, open, approved, approvers} = props;
  if (operations.length === 0) {
    return <p>There are no operations to approve</p>;
  }

  const totalAmount = '-EUR 15,256.89';

  return (
    <div className="pending-request-list">
      {!approved && (
        <div>
          <p className="header dark">
            {operations.length === 1 ? (
              <span>1 operation</span>
            ) : (
              <span>{operations.length} operations</span>
            )}

            <span>{totalAmount}</span>
          </p>
          <p className="header light">
            <span>pending approval</span>
            <span>TODAY, 10:45 AN</span>
          </p>
        </div>
      )}
      {_.map(operations, operation => {
        const currencyClass = operation.currency_name.toLowerCase();
        return (
          <div
            className={`pending-request operation ${approved ? 'watch' : ''}`}
            key={operation.uuid}
            onClick={() => open('operation', operation, approved)}>
            <div>
              <span className="request-date-creation">
                {formatDate(operation.time, 'LL')}
              </span>
              <span className="request-operation-amount crypto">
                -BTC 0.399823
              </span>
              <span className="request-operation-amount">-EUR 36.05</span>
            </div>
            <div>
              <span
                className={`request-approval-state ${approved
                  ? 'approved'
                  : ''}`}>
                {approved && <ValidateBadge className="confirmed" />}

                {approved ? 'Approved' : 'Collecting Approvals'}
                {` (3/6) `}
              </span>
              <span className="request-name operation bitcoin">
                Trackerfund
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

PendingOperationApprove.defaultProps = {
  approved: false,
  approvers: [],
};

PendingOperationApprove.propTypes = {
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ).isRequired,
  open: PropTypes.func.isRequired,
  approved: PropTypes.bool,
  approvers: PropTypes.arrayOf(PropTypes.shape({})),
};

export default PendingOperationApprove;
