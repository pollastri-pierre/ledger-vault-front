import _ from "lodash";
import React from "react";

const getAmount = (amount, currency) => {
  let sign = "";
  if (amount < 0) {
    sign = "-";
  } else {
    sign = "+";
  }
  return `${sign} ${currency} ${amount}`;
};

function TabDetails(props) {
  const { transaction } = props.operation;

  const sumOutputs = _.reduce(
    transaction.outputs,
    (sum, output) => {
      return sum + parseFloat(output.value, 10);
    },
    0
  );

  const sumInputs = _.reduce(
    transaction.inputs,
    (sum, input) => {
      return sum + parseFloat(input.value, 10);
    },
    0
  );

  return (
    <div className="operation-details-tab">
      <h4>Identifier</h4>
      <p>{transaction.hash}</p>
      <table className="operation-list details">
        <thead>
          <tr>
            <td>INPUTS</td>
            <td>
              <strong>{getAmount(sumInputs, "BTC")}</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {_.map(transaction.inputs, input => {
            return (
              <tr key={input.index}>
                <td className="not-bold">{input.address}</td>
                <td>{input.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table className="operation-list details">
        <thead>
          <tr>
            <td>OUTPUTS</td>
            <td>
              <strong>{getAmount(sumOutputs, "BTC")}</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {_.map(transaction.outputs, output => {
            return (
              <tr key={output.index}>
                <td className="not-bold">{output.address}</td>
                <td>{output.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TabDetails;
