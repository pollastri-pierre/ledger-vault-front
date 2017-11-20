//@flow
import React from "react";
import type { Operation } from "../../data/types";

const getAmount = (amount, currency) => {
  let sign = "";
  if (amount < 0) {
    sign = "-";
  } else {
    sign = "+";
  }
  return `${sign} ${currency} ${amount}`;
};

function TabDetails(props: { operation: Operation }) {
  const { transaction } = props.operation;

  const sumOutputs = transaction.outputs.reduce((sum, output) => {
    return sum + parseFloat(output.value);
  }, 0);

  const sumInputs = transaction.inputs.reduce((sum, input) => {
    return sum + parseFloat(input.value);
  }, 0);

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
          {transaction.inputs.map(input => {
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
          {transaction.outputs.map(output => {
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
