import _ from 'lodash';
import React from 'react';
import Infinite from 'react-infinite';
import PropTypes from 'prop-types';
import { SpinnerCard, Tooltip } from '../../components';
import Comment from '../../components/icons/Comment';
import DateFormat from '../../components/DateFormat';
import CurrencyNameValue from "../CurrencyNameValue";
import BadgeCurrency from '../../components/BadgeCurrency';


function List(props) {
  const { operations, title, loading, columnIds, accounts } = props;
  console.log(operations);
  const nbColumn = columnIds.length;

  const getHash = (operation) => {
    let hash = '';
    if (operation.type === 'SEND') {
      hash = operation.senders[0];
    } else {
      hash = operation.recipients[0];
    }

    return hash;
  };

  return (
    <div className="list">
      <h2>{title}</h2>
      {(loading || _.isNull(operations)) ?
        <SpinnerCard />
        :
        <Infinite
          containerHeight={900}
          elementHeight={46}
          useWindowAsScrollContainer
          handleScroll={() => {}}
        >
          <table>
            <thead>
              <tr>
                {
                  _.map(columnIds, (column, i) => {
                    return ([
                          (column === "amount" ? <td key={nbColumn} /> : false)
                        ,
                        <td className={(i === nbColumn - 1) ? "align-right" : ""} key={i}>{column}</td>
                    ])
                  })
                }
              </tr>
            </thead>
            <tbody>
              {_.map(operations, (operation) => {
                const note = (operation.notes.length > 0) ? operation.notes[0] : { author: {} };

                return (
                  <tr key={operation.uuid} onClick={e => props.open(operation.uuid)}>
                    {
                      _.map(columnIds, (column, i) => {

                        switch(column) {
                          case "date" :
                            return (
                              <td className="date" key={i}>
                                <DateFormat format="ddd D MMM, h:mmA" date={operation.time} />

                                <Comment fill="#e2e2e2"
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
                            );
                          case "account":
                            return (
                              <td key={i}>
                                <div>
                                  <BadgeCurrency currency={accounts[operation.account_id].currency}/>
                                  <span className="uppercase currencyName">{accounts[operation.account_id].name}</span>
                                </div>
                              </td>
                            )
                          case "adress":
                            return (
                              <td className="adress" key={i}>
                                <span className="type">{ (operation.type === 'SEND' ) ? 'TO' : 'FROM' }</span>
                                <span className="hash">{ getHash(operation) }</span>
                              </td>
                            )
                          case "status":
                            return (
                              <td className="status" key={i}>
                                <span>{ (operation.confirmations > 0 ) ? 'Confirmed' : 'Not confirmed'}</span>
                              </td>
                            )
                          case "amount":
                            return (
                              [
                              <td className="amount-euro" key={i}>
                                <CurrencyNameValue
                                  currencyName={operation.reference_conversion.currency_name}
                                  value={operation.reference_conversion.amount}
                                  alwaysShowSign
                                />
                              </td>,
                              <td key={nbColumn} className={`amount-crypto ${operation.amount > 0 ? "positive" : ""}`}>
                                <CurrencyNameValue currencyName={accounts[operation.account_id].currency.name} value={operation.amount} alwaysShowSign/>
                              </td>
                              ] 
                            )
                          default:
                            throw new Error(`Unsupported column name "${column}"`);
                        }
                      })
                    }
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Infinite>
      }
    </div>
  );
}
List.defaultProps = {
  title: 'Last operations',
  operations: null,
};

List.propTypes = {
  operations: PropTypes.array,
  title: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

export default List;
