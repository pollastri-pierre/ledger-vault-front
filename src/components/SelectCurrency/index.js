// @flow

import React, { PureComponent } from "react";
import Fuse from "fuse.js";
import { FixedSizeList as List } from "react-window";

import { components } from "react-select";
import { withTranslation } from "react-i18next";
import type {
  OptionProps,
  MenuListComponentProps,
} from "react-select/src/types";
import ERC20TokenIcon from "components/icons/ERC20Token";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { ERC20Token, Translate } from "data/types";
import {
  listCryptoCurrencies,
  listERC20Tokens,
  isERC20Token,
} from "utils/cryptoCurrencies";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import Text from "components/base/Text";
import Box from "components/base/Box";
import Select from "components/base/Select";
import colors from "shared/colors";

const ICON_SIZE = 16;

export type CurrencyItem = {
  type: "currency",
  value: CryptoCurrency,
};

export type ERC20TokenItem = {
  type: "erc20token",
  value: ERC20Token,
};

export type Item = CurrencyItem | ERC20TokenItem;
type Option = { label: string, value: string, data: Item };

function getItemIcon(item: Item) {
  return item.type === "erc20token" ? (
    <ERC20TokenIcon token={item.value} size={ICON_SIZE} />
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
      <span style={styles.contract}>{item.value.contract_address}</span>
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

const fuseCurrencies = new Fuse(currenciesOptions, fuseOptions);
const fuseTokens = new Fuse(erc20TokensOptions, fuseOptions);

const fetchOptions = (inputValue: string, options?: { noToken?: boolean }) =>
  new Promise(resolve => {
    window.requestAnimationFrame(() => {
      if (!inputValue) {
        if (options && options.noToken) {
          return resolve(currenciesOptions);
        }
        return resolve(fullOptions);
      }
      const resultCurrencies = fuseCurrencies.search(inputValue);
      if (options && options.noToken) {
        resolve(resultCurrencies);
      } else {
        const resultTokens = fuseTokens.search(inputValue);
        const results = [...resultCurrencies, ...resultTokens];
        resolve(results);
      }
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
const WindowList = (props: MenuListComponentProps) => {
  const height = 40;
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = value
    ? options.findIndex(o => o.label === value.label) * height
    : 0; // FIXME should we avoid to match on label? (erc20 don't have id)

  // el famoso Juan trick see: https://github.com/JedWatson/react-select/issues/3128#issuecomment-433834170
  if (children && children.forEach) {
    children.forEach(key => {
      delete key.props.innerProps.onMouseMove;
      delete key.props.innerProps.onMouseOver;
    });
  }
  return (
    <List
      height={options.length < 8 ? options.length * height : maxHeight}
      itemCount={options.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
      width="100%"
      overscanCount={8}
    >
      {({ index, style }) => (
        <div style={{ ...style, overflow: "hidden" }}>{children[index]}</div>
      )}
    </List>
  );
};
const MenuList = (props: MenuListComponentProps) => {
  return (
    <components.MenuList {...props}>
      <WindowList {...props} />
    </components.MenuList>
  );
};

const customComponents = {
  MenuList,
  Option: OptionComponent,
  SingleValue: ValueComponent,
};

type CurrencyOrToken = CryptoCurrency | ERC20Token;
type SingleValue = CurrencyOrToken | null;
type SingleHandler = (?Item) => void;

type MultipleValue = CurrencyOrToken[];
type MultipleHandler = (Item[]) => void;

type Props<T, H> = {
  t: Translate,
  value: T,
  noToken?: boolean,
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
    const { value, t, noToken, ...props } = this.props;

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
        loadOptions={str => fetchOptions(str, { noToken })}
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
    const { value, t, noToken, ...props } = this.props;

    // find the currency OR erc20token inside all options
    const resolvedValue = value ? getValueOption(value) : null;

    return (
      <Select
        async
        inputId="input_crypto"
        placeholder={t("newAccount:currency.placeholder")}
        defaultOptions
        isClearable
        loadOptions={str => fetchOptions(str, { noToken })}
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
