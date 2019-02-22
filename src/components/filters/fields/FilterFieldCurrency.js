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
import FieldTitle from "./FieldTitle";
import { defaultFieldProps } from "../FiltersCard";
import type { FieldProps } from "../FiltersCard";

type Props = FieldProps;

class FilterFieldCurrency extends PureComponent<Props> {
  static defaultProps = defaultFieldProps;

  handleChange = (item: ?SelectCurrencyItem) => {
    const { updateQuery } = this.props;
    if (!item) {
      updateQuery(q => omit(q, ["currency", "contract_address"]));
    } else if (item.type === "erc20token") {
      updateQuery(q => {
        q = omit(q, ["currency"]);
        // $FlowFixMe flow is incapable to infer that it's an ERC20Token
        q.contract_address = item.value.contract_address;
        return q;
      });
    } else if (item.type === "currency") {
      updateQuery(q => {
        q = omit(q, ["contract_address"]);
        // $FlowFixMe flow is incapable to infer that it's a currency
        q.currency = item.value.id;
        return q;
      });
    }
  };

  render() {
    const { query } = this.props;
    const currencyOrToken = resolveCurrencyOrToken(query);
    const isActive = !!currencyOrToken;
    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>Cryptocurrency</FieldTitle>
        <SelectCurrency value={currencyOrToken} onChange={this.handleChange} />
      </Box>
    );
  }
}

function resolveCurrencyOrToken(query: ObjectParameters) {
  if (query.currency) {
    if (typeof query.currency !== "string") return null;
    let currency = null;
    try {
      currency = getCryptoCurrencyById(query.currency) || null;
    } catch (err) {} // eslint-disable-line no-empty
    return currency;
  }
  if (query.contract_address) {
    if (typeof query.contract_address !== "string") return null;
    return getERC20TokenByContractAddress(query.contract_address) || null;
  }
  return null;
}

export default FilterFieldCurrency;
