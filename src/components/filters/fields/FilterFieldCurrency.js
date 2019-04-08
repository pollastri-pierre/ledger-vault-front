// @flow

import React, { PureComponent } from "react";
import omit from "lodash/omit";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { ObjectParameters } from "query-string";

import type { ERC20Token } from "data/types";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";

import SelectCurrency from "components/SelectCurrency";
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

  handleChange = (item: ?SelectCurrencyItem) => {
    const { updateQueryParams } = this.props;
    if (!item) {
      updateQueryParams(q => omit(q, ["currency", "contract_address"]));
    } else if (item.type === "erc20token") {
      updateQueryParams(q => {
        q = omit(q, ["currency"]);
        // $FlowFixMe flow is incapable to infer that it's an ERC20Token
        q.contract_address = item.value.contract_address;
        return q;
      });
    } else if (item.type === "currency") {
      updateQueryParams(q => {
        q = omit(q, ["contract_address"]);
        // $FlowFixMe flow is incapable to infer that it's a currency
        q.currency = item.value.id;
        return q;
      });
    }
  };

  Collapsed = () => {
    const { queryParams } = this.props;
    const currencyOrToken = resolveCurrencyOrToken(queryParams);
    if (!currencyOrToken) return;

    return (
      <Box horizontal flow={3} align="center">
        {getItemIcon(currencyOrToken)}
        <Text small>{currencyOrToken.name}</Text>
      </Box>
    );
  };

  render() {
    const { queryParams } = this.props;
    const currencyOrToken = resolveCurrencyOrToken(queryParams);
    const isActive = !!currencyOrToken;
    return (
      <WrappableField
        label="Cryptocurrency"
        RenderCollapsed={this.Collapsed}
        isActive={isActive}
        closeOnChange={currencyOrToken}
      >
        <SelectCurrency
          openMenuOnFocus={!currencyOrToken}
          autoFocus
          value={currencyOrToken}
          onChange={this.handleChange}
        />
      </WrappableField>
    );
  }
}

function resolveCurrencyOrToken(queryParams: ObjectParameters) {
  if (queryParams.currency) {
    if (typeof queryParams.currency !== "string") return null;
    let currency = null;
    try {
      currency = getCryptoCurrencyById(queryParams.currency) || null;
    } catch (err) {} // eslint-disable-line no-empty
    return currency;
  }
  if (queryParams.contract_address) {
    if (typeof queryParams.contract_address !== "string") return null;
    return getERC20TokenByContractAddress(queryParams.contract_address) || null;
  }
  return null;
}

function getItemIcon(item: CryptoCurrency | ERC20Token) {
  if ("contract_address" in item) return erc20TokenIcon;
  // $FlowFixMe dunno how to solve this
  const cur: CryptoCurrency = item;
  return <CryptoCurrencyIcon currency={cur} color={cur.color} size={13} />;
}

export default FilterFieldCurrency;
