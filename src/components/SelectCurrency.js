// @flow

import React, { PureComponent } from "react";
import Fuse from "fuse.js";
import { components } from "react-select";
import type { OptionProps } from "react-select/lib/types";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { ERC20Token } from "data/types";
import { listCryptoCurrencies, listERC20Tokens } from "utils/cryptoCurrencies";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import ERC20TokenIcon from "components/icons/ERC20Token";
import Select from "components/Select";

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

const buildOptions = (items: Item[]): Option[] =>
  items.map(item => ({ label: item.value.name, value: item }));

const INCLUDE_DEV = process.env.NODE_ENV === "development";

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
  includeMatches: true,
  threshold: 0.1,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["value.value.name", "value.value.ticker"]
};

const fuse = new Fuse(fullOptions, fuseOptions);

const fetchOptions = (inputValue: string) =>
  new Promise(resolve => {
    window.requestAnimationFrame(() => {
      if (!inputValue) return resolve(currenciesOptions);
      const result = fuse.search(inputValue);
      resolve(result.slice(0, 10).map(r => r.item));
    });
  });

const styles = {
  genericRowContainer: {
    fontSize: 13,
    height: ROW_SIZE,
    display: "flex",
    alignItems: "center"
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
  }
};

const erc20TokenIcon = <ERC20TokenIcon size={ICON_SIZE} />;

const GenericRow = (props: OptionProps) => {
  const { data } = props;
  const { value: item }: { value: Item } = data;
  const { type, value } = item;

  const icon =
    type === "erc20token" ? (
      erc20TokenIcon
    ) : (
      <CryptoCurrencyIcon
        currency={value}
        color={value.color}
        size={ICON_SIZE}
      />
    );

  const label =
    type === "erc20token" ? (
      <span>
        {`${value.name} - `}
        <b>{value.symbol}</b>{" "}
        <span style={styles.contract}>{`${value.contract_address.substr(
          0,
          15
        )}...`}</span>
      </span>
    ) : (
      value.name
    );

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

type Props = {
  value: ?Item,
  onChange: Item => void
};

class SelectCurrency extends PureComponent<Props> {
  render() {
    return (
      <Select
        async
        defaultOptions
        autoFocus
        openMenuOnFocus
        isClearable
        loadOptions={fetchOptions}
        components={customComponents}
        {...this.props}
      />
    );
  }
}

export default SelectCurrency;
