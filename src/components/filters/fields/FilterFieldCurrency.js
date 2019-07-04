// @flow

import React, { PureComponent } from "react";
import omit from "lodash/omit";
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

import type { Item as SelectCurrencyItem } from "components/SelectCurrency";
import { WrappableField, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters/types";

const erc20TokenIcon = <ERC20TokenIcon size={13} />;

class FilterFieldCurrency extends PureComponent<FieldProps> {
  static defaultProps = defaultFieldProps;

  handleChange = (items: SelectCurrencyItem[]) => {
    const { updateQueryParams } = this.props;
    if (items.length === 0) {
      updateQueryParams(q => {
        q = omit(q, ["currency", "contract_address"]);
        return q;
      });
    } else {
      const tokens = items.filter(i => i.type === "erc20token");
      const currencies = items.filter(i => i.type === "currency");

      const toOmit = [];

      let currencyStr;
      let tokenStr;

      updateQueryParams(q => {
        if (currencies.length > 0) {
          // $FlowFixMe flow is incapable to infer that it's a currency
          currencyStr = currencies.map(t => t.value.id).join();
        } else {
          toOmit.push("currency");
        }

        if (tokens.length > 0) {
          // $FlowFixMe flow is incapable to infer that it's a token
          tokenStr = tokens.map(t => t.value.contract_address).join();
        } else {
          toOmit.push("contract_address");
        }

        q = omit(q, toOmit);
        q.contract_address = tokenStr;
        q.currency = currencyStr;

        return q;
      });
    }
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

function resolveCurrenciesAndTokens(queryParams: ObjectParameters) {
  const currenciesAndTokens = [];

  if (queryParams.currency) {
    if (typeof queryParams.currency !== "string") return [];
    const currencies = queryParams.currency.split(",");
    currencies.forEach(c => {
      const curr = getCryptoCurrencyById(c) || null;
      if (curr) {
        currenciesAndTokens.push(curr);
      }
    });
  }
  if (queryParams.contract_address) {
    if (typeof queryParams.contract_address !== "string") return [];
    const tokens = queryParams.contract_address.split(",");
    tokens.forEach(t => {
      const token = getERC20TokenByContractAddress(t);
      if (token) {
        currenciesAndTokens.push(token);
      }
    });
  }
  return currenciesAndTokens;
}

function getItemIcon(item: CryptoCurrency | ERC20Token) {
  if ("contract_address" in item) return erc20TokenIcon;
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
