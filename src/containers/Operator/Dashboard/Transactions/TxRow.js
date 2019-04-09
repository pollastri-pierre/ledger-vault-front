// @flow

import React, { PureComponent, Fragment } from "react";

import type { Account, Transaction } from "data/types";

import TxTypeDate from "./TxTypeDate";
import TxAccountName from "./TxAccountName";
import TxStatus from "./TxStatus";
import TxAmount from "./TxAmount";
import TxHash from "./TxHash";

type Props = {
  transaction: Transaction,
  accounts: Account[],
};

class TxRow extends PureComponent<Props> {
  render() {
    const { transaction, accounts } = this.props;

    const account = accounts.find(
      account => account.id === transaction.account_id,
    );

    return (
      <Fragment>
        <TxTypeDate operation={transaction} />
        {account && <TxAccountName account={account} />}
        <TxStatus operation={transaction} />
        <TxHash operation={transaction} />
        {account && <TxAmount operation={transaction} account={account} />}
      </Fragment>
    );
  }
}

export default TxRow;
