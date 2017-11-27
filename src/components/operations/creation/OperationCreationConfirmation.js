//@flow
import React from "react";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";

import type { Account } from "../../../data/types";
import type { Details } from "../../NewOperationModal";

function OperationCreationConfirmation(props: { details: Details, account: Account }) {
  const { details, account } = props;

  console.log(details);

  return (
    <div>
      <OverviewOperation
        hash={details.address}
        amount={details.amount}
        account={account}
        rate={account.currencyRate}
      />
      <div className="operation-list">
        <LineRow label="account to debit">
          <AccountName name={account.name} currency={account.currency} />
        </LineRow>
        <LineRow label="confirmation fees">
          <Amount account={account} value={details.fees} rate={account.currencyRate} />
        </LineRow>
        <LineRow label="Total spent">
          <Amount
            account={account}
            value={details.amount}
            rate={account.currencyRate}
            strong
          />
        </LineRow>
      </div>
      <div className="operation-creation-confirmation-warning"
        style={{
          fontSize: "11px",
          color: "#767676",
          lineHeight: "1.82",
          marginTop: "30px"
        }}
        >
        A new operation request will be created. Funds will not be spent until the security scheme of the account is satisfied
      </div>
    </div>
  );
}

export default OperationCreationConfirmation;
