// @flow

import React, { PureComponent } from "react";
import { components } from "react-select";
import type { OptionProps } from "react-select/lib/types";

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
  data: Account
};

type GenericRowProps = OptionProps & {
  withBalance?: boolean
};

const GenericRow = (props: GenericRowProps) => {
  let { data: account, withBalance } = props;

  // this is ridiculous, but true. react-select is either wrapping the
  // data in { label, value } object or directly passing it, depending if
  // render in the menu or render in the input. this line is here to
  // unify this behaviour. btw it's happening here and not in SelectCurrency
  // because (i guess) the the SelectCurrency is async (only diff..)
  if ("label" in account && "data" in account) {
    account = account.data;
  }

  return (
    <Box horizontal align="center" justify="space-between" py={5}>
      <AccountName account={account} />
      {withBalance && (
        <Text small color={colors.mediumGrey}>
          <CurrencyAccountValue account={account} value={account.balance} />
        </Text>
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
    <GenericRow {...props} />
  </components.SingleValue>
);

const customComponents = {
  Option: OptionComponent,
  SingleValue: ValueComponent
};

const buildOption = account => ({
  label: account.name,
  value: `${account.id}`,
  data: account
});

type Props = {
  accounts: Account[],
  value: ?Account,
  onChange: (?Account) => void
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
        {...props}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}

export default SelectAccount;
