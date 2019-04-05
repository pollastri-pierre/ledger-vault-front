// @flow
import React from "react";
import { BigNumber } from "bignumber.js";
import type { Unit } from "@ledgerhq/live-common/lib/types";

import AccountCalculateFeeQuery from "api/queries/AccountCalculateFeeQuery";
import type { Account, OperationGetFees } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

export const getFees = async (
  account: Account,
  transaction: *,
  operation: OperationGetFees,
  restlay: RestlayEnvironment
) => {
  if (
    operation.amount.isGreaterThan(0) &&
    operation.recipient !== "" &&
    account
  ) {
    const query = new AccountCalculateFeeQuery({
      accountId: account.id,
      operation
    });
    const data = await restlay.fetchQuery(query);
    return data;
  }
  return {
    fees: BigNumber(0),
    gas_price: BigNumber(0),
    gas_limit: BigNumber(0)
  };
};

export const InputFieldMerge = ({ children }: *) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      width: "100%"
    }}
  >
    {children}
  </div>
);

const numbers = "0123456789";
export const sanitizeValueString = (
  unit: Unit,
  valueString: string
): {
  display: string,
  value: string
} => {
  let display = "";
  let value = "";
  let decimals = -1;
  for (let i = 0; i < valueString.length; i++) {
    const c = valueString[i];
    if (numbers.indexOf(c) !== -1) {
      if (decimals >= 0) {
        decimals++;
        if (decimals > unit.magnitude) break;
        value += c;
        display += c;
      } else if (value !== "0") {
        value += c;
        display += c;
      }
    } else if (decimals === -1 && (c === "," || c === ".")) {
      if (i === 0) display = "0";
      decimals = 0;
      display += ".";
    }
  }
  for (let i = Math.max(0, decimals); i < unit.magnitude; ++i) {
    value += "0";
  }
  if (!value) value = "0";
  return { display, value };
};
