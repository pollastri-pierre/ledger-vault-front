// @flow

import React, { PureComponent } from "react";
import { components } from "react-select";
import type { OptionProps } from "react-select/lib/types";

import type { Account } from "data/types";

import { getCryptoCurrencyById } from "utils/cryptoCurrencies";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import ERC20TokenIcon from "components/icons/ERC20Token";
import Select from "components/Select";
import colors from "shared/colors";

const ROW_SIZE = 20;
const ICON_SIZE = 16;

const erc20TokenIcon = <ERC20TokenIcon size={ICON_SIZE} />;

type Option = {
  label: string,
  value: Account
};

function getAccountIcon(account: Account) {
  if (account.account_type === "ERC20") {
    return erc20TokenIcon;
  }
  const currency = getCryptoCurrencyById(account.currency_id);
  if (!currency) return null;
  return account.account_type === "ERC20" ? (
    erc20TokenIcon
  ) : (
    <CryptoCurrencyIcon
      currency={currency}
      color={currency.color}
      size={ICON_SIZE}
    />
  );
}

function getAccountLabel(account: Account) {
  return account.name;
}

const styles = {
  genericRowContainer: {
    fontSize: 13,
    height: ROW_SIZE,
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap"
  },
  genericRowIcon: {
    height: ROW_SIZE,
    width: ROW_SIZE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  placeholder: {
    fontSize: 10,
    color: colors.shark
  }
};

const GenericRow = (props: OptionProps) => {
  let { data: account } = props;

  // this is ridiculous, but true. react-select is either wrapping the
  // data in { label, value } object or directly passing it, depending if
  // render in the menu or render in the input. this line is here to
  // unify this behaviour. btw it's happening here and not in SelectCurrency
  // because (i guess) the the SelectCurrency is async (only diff..)
  if ("label" in account && "value" in account) {
    account = account.value;
  }

  const icon = getAccountIcon(account);
  const label = getAccountLabel(account);

  return (
    <div style={styles.genericRowContainer}>
      <div style={styles.genericRowIcon}>{icon}</div>
      <div>{label}</div>
    </div>
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
  SingleValue: ValueComponent
};

const customStyles = {
  placeholder: provided => ({
    ...provided,
    fontSize: 10,
    color: colors.shark
  })
};

const buildOption = account => ({ label: account.name, value: account });

type Props = {
  accounts: Account[],
  value: ?Account,
  onChange: (?Account) => void
};

class SelectAccount extends PureComponent<Props> {
  handleChange = (option: ?Option) => {
    const { onChange } = this.props;
    if (!option) return onChange(null);
    onChange(option.value);
  };

  render() {
    const { value, accounts, onChange, ...props } = this.props;
    return (
      <Select
        options={accounts.map(buildOption)}
        components={customComponents}
        customStyles={customStyles}
        {...props}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}

export default SelectAccount;
