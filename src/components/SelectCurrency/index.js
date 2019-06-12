// @flow

import React, { PureComponent } from "react";
import Fuse from "fuse.js";
import { components } from "react-select";
import { Trans, withTranslation } from "react-i18next";
import type { OptionProps } from "react-select/src/types";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { ERC20Token, Translate } from "data/types";
import {
  listCryptoCurrencies,
  listERC20Tokens,
  isERC20Token,
} from "utils/cryptoCurrencies";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import ERC20TokenIcon from "components/icons/ERC20Token";
import Text from "components/base/Text";
import Box from "components/base/Box";
import Select from "components/base/Select";
import colors from "shared/colors";

const ICON_SIZE = 16;

type CurrencyItem = {
  type: "currency",
  value: CryptoCurrency,
};

type ERC20TokenItem = {
  type: "erc20token",
  value: ERC20Token,
};

export type Item = CurrencyItem | ERC20TokenItem;
type Option = { label: string, value: string, data: Item };

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
        15,
      )}...`}</span>
    </span>
  ) : (
    item.value.name
  );
}

const buildOptions = (items: Item[]): Option[] =>
  items.map(item => ({
    label: item.value.name,
    value: `${item.type}_${item.value.name}`,
    data: item,
  }));

// FINALLY we want testnet everywhere
const INCLUDE_DEV = true;

const currenciesItems = listCryptoCurrencies(INCLUDE_DEV).map(c => ({
  type: "currency",
  value: c,
}));

const erc20TokensItems = listERC20Tokens().map(t => ({
  type: "erc20token",
  value: t,
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
  keys: ["data.value.name", "data.value.ticker", "data.value.contract_address"],
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
    const isOptERC20Token = isERC20Token(opt.data.value);
    if (isValueERC20Token !== isOptERC20Token) return false;
    if (
      isValueERC20Token &&
      // $FlowFixMe inference fail: we are sure both are erc20
      opt.data.value.contract_address === value.contract_address
    )
      return true;
    // $FlowFixMe inference fail: we are sure both are currencies
    if (!isValueERC20Token && opt.data.value.id === value.id) return true;
    return false;
  });
  return resolved || null;
};

const getMultipleValuesOptions = (values: *): Option[] => {
  if (!values) return [];
  const options = [];
  values.forEach(v => {
    const option = getValueOption(v);
    if (option) {
      options.push(option);
    }
  });
  return options;
};

const styles = {
  contract: {
    fontSize: 10,
    fontFamily: "monospace",
    padding: 4,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  erc20Hint: {
    backgroundColor: colors.cream,
    textAlign: "center",
    color: colors.steel,
    padding: 5,
  },
  icon: {
    marginLeft: 2,
  },
};

const erc20TokenIcon = <ERC20TokenIcon size={ICON_SIZE} />;

const GenericRow = (props: OptionProps) => {
  const { data } = props;
  const item: Item = data.data;

  const icon = getItemIcon(item);
  const label = getItemLabel(item);

  return (
    <Box horizontal align="center" flow={10} py={5}>
      <Box align="center" justify="center" ml={2}>
        {icon}
      </Box>
      <Text lineHeight={1}>{label}</Text>
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
const MenuComponent = (props: OptionProps) => (
  <components.Menu {...props}>
    {props.children}
    {props.options === currenciesOptions && !props.hasValue && (
      <Text small italic style={styles.erc20Hint}>
        <Trans
          i18nKey="newAccount:search.extraERC20"
          values={{
            erc20Count: erc20TokensOptions.length + currenciesOptions.length,
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
  Menu: MenuComponent,
};

type CurrencyOrToken = CryptoCurrency | ERC20Token;
type SingleValue = CurrencyOrToken | null;
type SingleHandler = (?Item) => void;

type MultipleValue = CurrencyOrToken[];
type MultipleHandler = (Item[]) => void;

type Props<T, H> = {
  t: Translate,
  value: T,
  onChange: H,
};

class Multiple extends PureComponent<Props<MultipleValue, MultipleHandler>> {
  handleChange = (options: Option[]) => {
    const { onChange } = this.props;
    if (options && options.length) {
      onChange(options.map(o => o.data));
    } else {
      onChange([]);
    }
  };

  render() {
    const { value, t, ...props } = this.props;

    // find the currency OR erc20token inside all options
    const resolvedValues =
      value && value.length ? getMultipleValuesOptions(value) : [];

    return (
      <Select
        async
        inputId="input_crypto"
        placeholder={t("newAccount:currency.placeholder")}
        defaultOptions
        isMulti
        isClearable
        loadOptions={fetchOptions}
        components={customComponents}
        {...props}
        onChange={this.handleChange}
        value={resolvedValues}
      />
    );
  }
}
class SelectCurrency extends PureComponent<Props<SingleValue, SingleHandler>> {
  handleChange = (option: ?Option) => {
    const { onChange } = this.props;
    if (!option) return onChange(null);
    onChange(option.data);
  };

  render() {
    const { value, t, ...props } = this.props;

    // find the currency OR erc20token inside all options
    const resolvedValue = value ? getValueOption(value) : null;

    return (
      <Select
        async
        inputId="input_crypto"
        placeholder={t("newAccount:currency.placeholder")}
        defaultOptions
        isClearable
        loadOptions={fetchOptions}
        components={customComponents}
        {...props}
        onChange={this.handleChange}
        value={resolvedValue}
      />
    );
  }
}

const SelectCurrencyMultiple = withTranslation()(Multiple);
export { SelectCurrencyMultiple };
export default withTranslation()(SelectCurrency);
