// @flow

import React, { PureComponent } from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { ObjectParameters } from "query-string";

import type { ERC20Token } from "data/types";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";

import { SelectCurrencyMultiple } from "components/SelectCurrency";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import ERC20TokenIcon from "components/icons/ERC20Token";

import Text from "components/base/Text";
import Box from "components/base/Box";

import type {
  Item as SelectCurrencyItem,
  ERC20TokenItem,
  CurrencyItem,
} from "components/SelectCurrency";
import { WrappableField, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters/types";

class FilterFieldCurrency extends PureComponent<FieldProps> {
  static defaultProps = defaultFieldProps;

  handleChange = (items: SelectCurrencyItem[]) => {
    const { updateQueryParams } = this.props;

    if (items.length === 0) {
      return updateQueryParams("currency", null);
    }

    // $FlowFixMe dumbest parser ever
    const tokens: ERC20TokenItem[] = items.filter(i => i.type === "erc20token");
    // $FlowFixMe dumbest parser ever
    const currencies: CurrencyItem[] = items.filter(i => i.type === "currency");

    const q = [
      ...currencies.map(c => c.value.id),
      ...tokens.map(t => `ethereum:${t.value.contract_address}`),
    ];

    updateQueryParams("currency", q);
  };

  Collapsed = () => {
    const { queryParams } = this.props;
    const currenciesAndToken = resolveCurrenciesAndTokens(queryParams);
    if (!currenciesAndToken) return;

    return (
      <Box horizontal flow={10}>
        {currenciesAndToken.map(c => (
          <Box horizontal align="center" flow={3} key={getItemId(c)}>
            {getItemIcon(c)}
            <Text noWrap>{c.name}</Text>
          </Box>
        ))}
      </Box>
    );
  };

  render() {
    const { queryParams } = this.props;
    const currenciesAndToken = resolveCurrenciesAndTokens(queryParams);
    const isActive = !!currenciesAndToken && !!currenciesAndToken.length;
    return (
      <WrappableField
        label="Crypto asset"
        RenderCollapsed={this.Collapsed}
        isActive={isActive}
        closeOnChange={false}
        width={530}
      >
        <SelectCurrencyMultiple
          openMenuOnFocus={currenciesAndToken.length === 0}
          autoFocus
          value={currenciesAndToken}
          onChange={this.handleChange}
        />
      </WrappableField>
    );
  }
}

function resolveOptions(els: string[]) {
  return els
    .map(el => {
      const isToken = /.+:0x.+/.test(el);
      if (isToken) {
        const contract = el.split(":")[1];
        return getERC20TokenByContractAddress(contract);
      }
      try {
        return getCryptoCurrencyById(el);
      } catch (err) {
        return null;
      }
    })
    .filter(Boolean);
}

function resolveCurrenciesAndTokens(queryParams: ObjectParameters) {
  if (!queryParams.currency) return [];
  if (typeof queryParams.currency === "string")
    return resolveOptions([queryParams.currency]);
  if (Array.isArray(queryParams.currency))
    // $FlowFixMe
    return resolveOptions(queryParams.currency);
  return [];
}

function getItemIcon(item: CryptoCurrency | ERC20Token) {
  if ("contract_address" in item) {
    // $FlowFixMe dunno how to solve this
    return <ERC20TokenIcon size={13} token={item} />;
  }
  // $FlowFixMe dunno how to solve this
  const cur: CryptoCurrency = item;
  return <CryptoCurrencyIcon currency={cur} color={cur.color} size={13} />;
}

function getItemId(item: CryptoCurrency | ERC20Token) {
  if ("contract_address" in item) return item.name;
  // $FlowFixMe me neither
  return item.id;
}

export default FilterFieldCurrency;
