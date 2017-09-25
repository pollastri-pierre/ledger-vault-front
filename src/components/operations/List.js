import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '../../components';


function List(props) {
  const { operations, title } = props;

  if (operations.length === 0) {
    return (
      <div>NO OPERATIONS FOUND</div>
    );
  }

  const getHash = operation => {
    let hash = '';
    if (operation.type === 'SEND') {
      hash = operation.senders[0];
    } else {
      hash = operation.recipients[0];
    }

    return hash;
  };

  const getCrypto = amount => {
    if (amount > 0) {
      return `+ BTC ${amount}`;
    }

    return `- BTC ${amount}`;
  };

  return (
    <div className='list'>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Address</td>
            <td />
            <td>Status</td>
            <td />
            <td />
            <td className="align-right">Amount</td>
          </tr>
        </thead>
        <tbody>
          {_.map(operations, (operation) => {
            const note = (operation.notes.length > 0) ? operation.notes[0] : {author: {}};

            return (
              <tr key={operation.uuid} onClick={(e) => props.open(operation.uuid)}>
                <td className="date">
                  {operation.time}

                  <a
                    onClick={(e) => {e.stopPropagation(); props.open(operation.uuid, 2)}} 
                    className="open-label"
                    data-tip
                    data-for={`tooltip-${operation.uuid}`}
                  />
                  { (operation.notes.length > 0) ?
                    <Tooltip id={`tooltip-${operation.uuid}`} className='tooltip-label'>
                      <p className="tooltip-label-title">{note.title}</p>
                      <p className="tooltip-label-name">{note.author.firstname} {note.author.name}</p>
                      <div className="hr" />
                      <p className="tooltip-label-body">{note.body}</p>
                    </Tooltip>
                    : false
                  }
                </td>
                <td className="type">{ (operation.type === 'SEND' ) ? 'TO' : 'FROM'}</td>
                <td className="hash">{ getHash(operation) }</td>
                <td className="status">{ (operation.confirmations > 0 ) ? 'Confirmed' : 'Not confirmed'}</td>
                <td />
                <td className="amount-euro">+ EUR 21.89</td>
                <td className={`amount-crypto ${operation.amount > 0 ? "positive" : ""}`}>{getCrypto(operation.amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
List.defaultProps = {
  title: 'Last operations',
};

List.propTypes = {
  operations: PropTypes.array.isRequired,
  title: PropTypes.string,
};

export default List;
