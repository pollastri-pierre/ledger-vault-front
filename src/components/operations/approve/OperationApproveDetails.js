// @flow
import React, { Fragment } from "react";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";
import type { Operation, Account } from "data/types";
import CopyToClipboardButton from "components/CopyToClipboardButton";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import DateFormat from "../../DateFormat";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";

function OperationApproveDetails(props: {
  operation: Operation,
  account: Account
}) {
  const { operation, account } = props;
  const isETHType =
    account.account_type === "ERC20" || account.account_type === "Ethereum";
  return (
    <div>
      <OverviewOperation
        amount={operation.price ? operation.price.amount : BigNumber(0)}
        account={account}
        operationType={operation.type}
      />
      <div className="operation-list">
        <LineRow label={<Trans i18nKey="newOperation:details.identifier" />}>
          {operation.recipient && (
            <CopyToClipboardButton textToCopy={operation.recipient} />
          )}
        </LineRow>
        <LineRow label={<Trans i18nKey="newOperation:details.date" />}>
          <DateFormat date={operation.created_on} />
        </LineRow>
        <LineRow label={<Trans i18nKey="newOperation:details.account" />}>
          <AccountName account={account} />
        </LineRow>
        {isETHType ? (
          <Fragment>
            <LineRow label={<Trans i18nKey="newOperation:details.gas_price" />}>
              <Amount
                account={account}
                value={operation.gas_price || BigNumber(0)}
                hideCountervalue
              />
            </LineRow>
            <LineRow label={<Trans i18nKey="newOperation:details.gas_limit" />}>
              <span>{(operation.gas_limit || BigNumber(0)).toFixed()}</span>
            </LineRow>
          </Fragment>
        ) : (
          <LineRow
            label={<Trans i18nKey="newOperation:details.confirmation_fee" />}
          >
            <Amount account={account} value={operation.fees} />
          </LineRow>
        )}
        <LineRow label={<Trans i18nKey="newOperation:details.total" />}>
          <Amount
            account={account}
            value={operation.price ? operation.price.amount : BigNumber(0)}
            strong
            erc20Format={account.account_type === "ERC20"}
          />
        </LineRow>
      </div>
    </div>
  );
}

export default OperationApproveDetails;
