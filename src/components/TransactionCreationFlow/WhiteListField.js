// @flow

import React, { useState, useMemo } from "react";
import { components } from "react-select";
import type { Account } from "data/types";
import Tooltip from "@material-ui/core/Tooltip";
import type { OptionProps } from "react-select/src/types";

import { useTranslation } from "react-i18next";
import { FaList, FaPen } from "react-icons/fa";
import Box from "components/base/Box";
import Select from "components/base/Select";
import Button from "components/base/Button";
import { Label } from "components/base/form";
import InputAddress from "components/TransactionCreationFlow/InputAddress";

type WhitelistProps = {
  account: Account,
  transaction: any,
  onChangeTransaction: Function,
  bridge: any,
};

const customValueStyle = {
  singleValue: styles => ({
    ...styles,
    color: "inherit",
    width: "100%",
    paddingRight: 10,
  }),
};

const GenericRow = (props: OptionProps) => {
  const {
    data: { data: address },
  } = props;

  return (
    <Box horizontal justify="space-between">
      <Box>{address.name}</Box>
      <Box>{address.address}</Box>
    </Box>
  );
};

const OptionComponent = (props: OptionProps) => (
  <components.Option {...props}>
    <GenericRow {...props} />
  </components.Option>
);
const ValueComponent = (props: OptionProps) => (
  <components.SingleValue {...props}>
    <GenericRow {...props} />
  </components.SingleValue>
);

const customComponents = {
  Option: OptionComponent,
  SingleValue: ValueComponent,
};

function WhitelistField(props: WhitelistProps) {
  const [inputToggle, setInputToggle] = useState(false);
  const { t } = useTranslation();

  const { account, transaction, onChangeTransaction, bridge } = props;

  const addressArray = account.governance_rules
    .map(governanceRule => governanceRule.rules)
    .reduce((res, rules) => {
      rules.map(rule => {
        if (rule.type === "WHITELIST") {
          rule.data.map(item => {
            if (typeof item === "number") return res;
            return item.addresses.map(address => {
              return res.push(address);
            });
          });
          return res;
        }
        return res;
      });

      return res;
    }, []);
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
    const address = addressArray.find(item => item.address === recipient);
    return address
      ? {
          value: address.name,
          label: address.address,
          data: address,
        }
      : null;
  };
  const getWhitelistValue = () => {
    return transaction.recipient === ""
      ? null
      : findInAddressArray(transaction.recipient);
  };

  const options = useMemo(
    () =>
      addressArray.map(address => ({
        label: address.name,
        value: address.address,
        data: address,
      })),
    [addressArray],
  );

  return (
    <Box>
      <Label>{t("transactionCreation:steps.account.recipient")}</Label>
      <Box horizontal justify="space-between" flow={10}>
        <Box grow>
          {isWhiteListOnly || (addressArray.length > 0 && !inputToggle) ? (
            <Select
              options={options}
              components={customComponents}
              placeholder={t("transactionCreation:steps.account.select")}
              onChange={handleChange}
              styles={customValueStyle}
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
        {addressArray.length > 0 && !isWhiteListOnly && (
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
