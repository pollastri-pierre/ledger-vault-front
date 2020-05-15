// @flow

import React, { PureComponent } from "react";
import { components } from "react-select";
import type { OptionProps } from "react-select/src/types";

import type { Account } from "data/types";

import AccountName from "components/AccountName";
import Select from "components/base/Select";
import Box from "components/base/Box";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Text from "components/base/Text";
import colors from "shared/colors";

type Option = {
  label: string,
  value: string,
  data: Account,
};

type GenericRowProps = OptionProps & {
  withBalance?: boolean,
};

const SelectedRow = (props: OptionProps) => {
  const { data: account } = props;

  return (
    <Box horizontal align="center" justify="space-between">
      <AccountName account={account} />
      <Box align="flex-end">
        <Box flow={10} horizontal align="center">
          <Text fontWeight="semiBold" color={colors.mediumGrey}>
            Available
          </Text>
          <Text fontWeight="semiBold" color={colors.black}>
            <CurrencyAccountValue
              account={account}
              value={account.available_balance}
            />
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const GenericRow = (props: GenericRowProps) => {
  const { withBalance } = props;
  const {
    data: { data: account },
  } = props;

  return (
    <Box horizontal align="center" justify="space-between" py={5}>
      <AccountName account={account} />
      {withBalance && (
        <Box align="flex-end">
          {account.account_type === "Bitcoin" && (
            <Box flow={10} horizontal align="center">
              <Text fontWeight="semiBold" color={colors.mediumGrey}>
                Available
              </Text>
              <Text fontWeight="semiBold" color={colors.black}>
                <CurrencyAccountValue
                  account={account}
                  value={account.available_balance}
                />
              </Text>
            </Box>
          )}
          <Box flow={10} horizontal align="center">
            <Text fontWeight="semiBold" color={colors.mediumGrey}>
              Total
            </Text>
            <Text fontWeight="semiBold" color={colors.mediumGrey}>
              <CurrencyAccountValue account={account} value={account.balance} />
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const OptionComponent = (props: OptionProps) => (
  <components.Option {...props}>
    <GenericRow {...props} withBalance />
  </components.Option>
);

const ValueComponent = (props: OptionProps) => (
  <components.SingleValue {...props}>
    <SelectedRow {...props} />
  </components.SingleValue>
);

const customValueStyle = {
  singleValue: (styles) => ({
    ...styles,
    color: "inherit",
    width: "100%",
    paddingRight: 10,
  }),
};

const customComponents = {
  Option: OptionComponent,
  SingleValue: ValueComponent,
};

const buildOption = (account) => ({
  label: account.name,
  value: `${account.id}`,
  data: account,
});

type Props = {
  accounts: Account[],
  value: ?Account,
  onChange: (?Account) => void,
};

class SelectAccount extends PureComponent<Props> {
  handleChange = (option: ?Option) => {
    const { onChange } = this.props;
    if (!option) return onChange(null);
    onChange(option.data);
  };

  render() {
    const { value, accounts, onChange, ...props } = this.props;
    return (
      <Select
        options={accounts.map(buildOption)}
        components={customComponents}
        styles={customValueStyle}
        placeholder="Select an account"
        inputId="input_account"
        {...props}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}

export default SelectAccount;
