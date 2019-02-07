// @flow

import React, { PureComponent } from "react";
import Fuse from "fuse.js";
import { components } from "react-select";
import { Trans } from "react-i18next";
import type { OptionProps } from "react-select/lib/types";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { ERC20Token } from "data/types";
import {
  listCryptoCurrencies,
  listERC20Tokens,
  isERC20Token
} from "utils/cryptoCurrencies";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import ERC20TokenIcon from "components/icons/ERC20Token";
import Text from "components/Text";
import Select from "components/Select";
import colors from "shared/colors";

const ROW_SIZE = 20;
const ICON_SIZE = 16;

type CurrencyItem = {
  type: "currency",
  value: CryptoCurrency
};

type ERC20TokenItem = {
  type: "erc20token",
  value: ERC20Token
};

export type Item = CurrencyItem | ERC20TokenItem;
type Option = { label: string, value: Item };

function getItemIcon(item: Item) {
  return item.type === "erc20token" ? (
    erc20TokenIcon
  ) : (
    <CryptoCurrencyIcon
      currency={item.value}
      color={item.value.color}
      size={ICON_SIZE}
    />
  );
}

function getItemLabel(item: Item) {
  return item.type === "erc20token" ? (
    <span>
      {`${item.value.name} - `}
      <b>{item.value.ticker}</b>{" "}
      <span style={styles.contract}>{`${item.value.contract_address.substr(
        0,
        15
      )}...`}</span>
    </span>
  ) : (
    item.value.name
  );
}

const buildOptions = (items: Item[]): Option[] =>
  items.map(item => ({ label: item.value.name, value: item }));

const INCLUDE_DEV =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "e2e" ||
  window.config.SOFTWARE_DEVICE;

const currenciesItems = listCryptoCurrencies(INCLUDE_DEV).map(c => ({
  type: "currency",
  value: c
}));

const erc20TokensItems = listERC20Tokens().map(t => ({
  type: "erc20token",
  value: t
}));

const currenciesOptions = buildOptions(currenciesItems);
const erc20TokensOptions = buildOptions(erc20TokensItems);
const fullOptions = [...currenciesOptions, ...erc20TokensOptions];

const fuseOptions = {
  shouldSort: true,
  threshold: 0.1,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "value.value.name",
    "value.value.ticker",
    "value.value.contract_address"
  ]
};

const fuse = new Fuse(fullOptions, fuseOptions);

const fetchOptions = (inputValue: string) =>
  new Promise(resolve => {
    window.requestAnimationFrame(() => {
      if (!inputValue) return resolve(currenciesOptions);
      const result = fuse.search(inputValue);
      resolve(result.slice(0, 10));
    });
  });

const getValueOption = (value: CryptoCurrency | ERC20Token): Option | null => {
  if (!value) return null;
  const isValueERC20Token = isERC20Token(value);
  const resolved = fullOptions.find((opt: Option) => {
    const isOptERC20Token = isERC20Token(opt.value.value);
    if (isValueERC20Token !== isOptERC20Token) return false;
    if (
      isValueERC20Token &&
      // $FlowFixMe inference fail: we are sure both are erc20
      opt.value.value.contract_address === value.contract_address
    )
      return true;
    // $FlowFixMe inference fail: we are sure both are currencies
    if (!isValueERC20Token && opt.value.value.id === value.id) return true;
    return false;
  });
  return resolved || null;
};

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
  contract: {
    fontSize: 10,
    fontFamily: "monospace",
    padding: 4,
    backgroundColor: "rgba(0, 0, 0, 0.05)"
  },
  placeholder: {
    fontSize: 10,
    color: colors.shark
  },
  erc20Hint: {
    backgroundColor: colors.cream,
    textAlign: "center",
    color: colors.steel,
    padding: 5
  }
};

const erc20TokenIcon = <ERC20TokenIcon size={ICON_SIZE} />;

const GenericRow = (props: OptionProps) => {
  const { data } = props;
  const item: Item = data.value;

  const icon = getItemIcon(item);
  const label = getItemLabel(item);

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
const MenuComponent = (props: OptionProps) => (
  <components.Menu {...props}>
    {props.children}
    {props.options === currenciesOptions &&
      !props.hasValue && (
        <Text small italic style={styles.erc20Hint}>
          <Trans
            i18nKey="newAccount:search.extraERC20"
            values={{
              erc20Count: erc20TokensOptions.length + currenciesOptions.length
            }}
            components={<b>0</b>}
          />
        </Text>
      )}
  </components.Menu>
);

const customComponents = {
  Option: OptionComponent,
  SingleValue: ValueComponent,
  Menu: MenuComponent
};

const customStyles = {
  placeholder: provided => ({
    ...provided,
    fontSize: 10,
    color: colors.shark
  })
};

type Props = {
  value: CryptoCurrency | ERC20Token | null,
  onChange: (?Item) => void
};

class SelectCurrency extends PureComponent<Props> {
  handleChange = (option: ?Option) => {
    const { onChange } = this.props;
    if (!option) return onChange(null);
    onChange(option.value);
  };

  render() {
    const { value } = this.props;

    // find the currency OR erc20token inside all options
    const resolvedValue = value ? getValueOption(value) : null;
    return (
      <Select
        async
        inputId="input_crypto"
        defaultOptions
        isClearable
        loadOptions={fetchOptions}
        components={customComponents}
        styles={customStyles}
        {...this.props}
        onChange={this.handleChange}
        value={resolvedValue}
      />
    );
  }
}

export default SelectCurrency;
