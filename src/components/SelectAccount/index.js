// @flow

import React, { PureComponent } from "react";
import { components } from "react-select";
import type { OptionProps } from "react-select/lib/types";

import type { Account } from "data/types";

import AccountName from "components/AccountName";
import Select from "components/base/Select";

type Option = {
  label: string,
  value: string,
  data: Account
};

const GenericRow = (props: OptionProps) => {
  let { data: account } = props;

  // this is ridiculous, but true. react-select is either wrapping the
  // data in { label, value } object or directly passing it, depending if
  // render in the menu or render in the input. this line is here to
  // unify this behaviour. btw it's happening here and not in SelectCurrency
  // because (i guess) the the SelectCurrency is async (only diff..)
  if ("label" in account && "data" in account) {
    account = account.data;
  }

  return <AccountName py={5} account={account} />;
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
