// @flow

import React, { PureComponent } from "react";
import omit from "lodash/omit";

import type { ObjectParameters } from "query-string";

import {
  getCryptoCurrencyById,
  getERC20TokenByContractAddress
} from "utils/cryptoCurrencies";

import SelectCurrency from "components/SelectCurrency";

import Box from "components/base/Box";

import type { Item as SelectCurrencyItem } from "components/SelectCurrency";
import { FieldTitle, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters/types";

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

  render() {
    const { queryParams } = this.props;
    const currencyOrToken = resolveCurrencyOrToken(queryParams);
    const isActive = !!currencyOrToken;
    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>Cryptocurrency</FieldTitle>
        <SelectCurrency value={currencyOrToken} onChange={this.handleChange} />
      </Box>
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

export default FilterFieldCurrency;
