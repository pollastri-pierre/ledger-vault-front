// @flow

import React, { useState, useMemo } from "react";
import type { Account, Whitelist } from "data/types";
import Tooltip from "@material-ui/core/Tooltip";

import { useTranslation } from "react-i18next";
import { FaList, FaPen } from "react-icons/fa";
import Box from "components/base/Box";
import { hasPendingRequest } from "utils/entities";
import Button from "components/base/Button";
import { Label } from "components/base/form";
import InputAddress from "components/TransactionCreationFlow/InputAddress";
import SelectAddress from "./SelectAddress";

type WhitelistProps = {
  account: Account,
  transaction: any,
  onChangeTransaction: Function,
  whitelists: Whitelist[],
  bridge: any,
};

function WhitelistField(props: WhitelistProps) {
  const [inputToggle, setInputToggle] = useState(false);
  const { t } = useTranslation();

  const {
    account,
    transaction,
    onChangeTransaction,
    bridge,
    whitelists,
  } = props;

  // extract all active whitelist from the nested structure multiRules
  const allWhitelistsForAccount = resolveWhitelists(account, whitelists);

  const isWhiteListOnly =
    account.governance_rules.filter(governanceRule =>
      governanceRule.rules.find(rule => rule.type === "WHITELIST"),
    ).length === account.governance_rules.length;

  const handleChange = (recipient: any) => {
    onChangeTransaction(
      bridge.editTransactionRecipient(account, transaction, recipient.value),
    );
  };

  const toggleInput = () => {
    setInputToggle(!inputToggle);
  };

  const findInAddressArray = (recipient: string) => {
    // $FlowFixMe flat exist on Array but Flow doesnt know yet
    const allAddresses = options.map(o => o.options).flat();

    const address = allAddresses.find(item => item.value === recipient);
    return address || null;
  };
  const getWhitelistValue = () => {
    return transaction.recipient === ""
      ? null
      : findInAddressArray(transaction.recipient);
  };

  const isWhitelistDisabled = (w: Whitelist) =>
    w.status !== "ACTIVE" || hasPendingRequest(w);

  const options = useMemo(() => {
    const options = [];
    allWhitelistsForAccount.forEach(w => {
      const data = w.addresses
        .filter(w => w.currency === account.currency)
        .map(address => ({
          label: address.name,
          value: address.address,
          data: address,
          isDisabled: isWhitelistDisabled(w),
        }));
      if (data.length) {
        options.push({
          label: w.name,
          options: data,
          isDisabled: isWhitelistDisabled(w),
          whitelist: w,
        });
      }
    });
    return options;
  }, [allWhitelistsForAccount, account]);

  const hasAddressToSelect =
    options.length > 0 && options.some(o => o.options.length > 0);
  return (
    <Box>
      <Label>{t("transactionCreation:steps.account.recipient")}</Label>
      <Box horizontal justify="space-between" flow={10}>
        <Box grow>
          {isWhiteListOnly || (hasAddressToSelect && !inputToggle) ? (
            <SelectAddress
              options={options}
              onChange={handleChange}
              value={getWhitelistValue()}
            />
          ) : (
            <InputAddress
              placeholder={t("transactionCreation:steps.account.recipient")}
              autoFocus
              account={account}
              transaction={transaction}
              onChangeTransaction={onChangeTransaction}
              bridge={bridge}
            />
          )}
        </Box>
        {hasAddressToSelect && !isWhiteListOnly && (
          <Tooltip
            placement="top"
            title={
              inputToggle
                ? t("transactionCreation:steps.account.tooltip.whitelist")
                : t("transactionCreation:steps.account.tooltip.customAddress")
            }
          >
            <Button onClick={toggleInput} style={{ borderRadius: 4 }}>
              {inputToggle ? <FaList size={12} /> : <FaPen size={12} />}
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

export default WhitelistField;

function resolveWhitelists(
  account: Account,
  whitelists: Whitelist[],
): Whitelist[] {
  return (
    account.governance_rules
      .map(g => g.rules)
      // $FlowFixMe flat exist on Array but Flow doesnt know yet
      .flat()
      .filter(r => r.type === "WHITELIST")
      .map(r => r.data)
      // $FlowFixMe flat exist on Array but Flow doesnt know yet
      .flat()
      .map(w => {
        if (typeof w === "number") return whitelists.find(w2 => w2.id === w);

        // we don't use whitelist from account.gov_rule on purpose because we are not sure it will contain last_request
        return whitelists.find(w2 => w2.id === w.id);
      })
      .filter(Boolean)
  );
}
