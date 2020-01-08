// @flow

import React from "react";
import { connect } from "react-redux";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import type { BigNumber as BigNumberType } from "bignumber.js";

import Box from "components/base/Box";
import type { Connection } from "restlay/ConnectionQuery";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import counterValues from "data/counterValues";
import Card from "components/base/Card";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import PieChart from "components/base/PieChart";
import colors, { opacity } from "shared/colors";
import SearchAccounts from "api/queries/SearchAccounts";
import type { Account } from "data/types";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById,
} from "@ledgerhq/live-common/lib/currencies";
import Widget, { connectWidget } from "./Widget";

type CountervalueData = {
  [_: string]: { value: BigNumberType, color: string },
};

type Props = {
  accountsConnection: Connection<Account>,
  countervalues: CountervalueData,
  total: BigNumberType,
  nbMax?: number,
};

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");
const eth = getCryptoCurrencyById("ethereum");

const mapStateToProps = (state, props) => {
  const accounts = props.accountsConnection.edges.map(el => el.node);
  let total = BigNumber(0);
  const countervalues = accounts.reduce((result, account) => {
    const from = resolveFrom(account);
    const isERC20 = account.account_type === "Erc20";
    if (from && account.balance.isGreaterThan(0)) {
      const countervalue = counterValues.calculateWithIntermediarySelector(
        state,
        {
          // $FlowFixMe I guarantee from is compatible with CurrencyCommon :doge:
          from: { ticker: from.ticker },
          fromExchange: state.exchanges.data[from.ticker],
          intermediary: intermediaryCurrency,
          toExchange: state.exchanges.data.USD,
          to: getFiatCurrencyByTicker("USD"),
          value: account.balance,
        },
      );
      if (!countervalue) return result;
      // we don't have CV for erc20 yet, but the day we have them
      // we want to group them in one single entry because we have
      // only 1 color to represent them
      const currencyIndex = isERC20 ? "Erc20" : account.currency;
      if (!result[currencyIndex]) {
        result[currencyIndex] = {
          value: BigNumber(0),
          // $FlowFixMe flow does not get that if !isERC20 we have a color
          color: isERC20 ? opacity(eth.color, 0.5) : from.color,
        };
      }
      result[currencyIndex].value = result[currencyIndex].value.plus(
        countervalue,
      );
      total = total.plus(countervalue);
    }
    return result;
  }, {});
  return { countervalues, total };
};

function AssetsDistributionWidget(props: Props) {
  const { countervalues, total, nbMax, accountsConnection } = props;

  const array = Object.keys(countervalues).map(key => {
    return {
      label: key,
      value: countervalues[key].value,
      color: countervalues[key].color,
    };
  });

  // we sort the array so we can take the biggest nbMax currencies
  array.sort((a, b) => a.value.isGreaterThan(b.value));

  // computing the "OTHER" part based on nbMax and reformating the array into object
  let totalOthers = BigNumber(0);
  for (let i = nbMax || array.length; i < array.length; i++) {
    totalOthers = totalOthers.plus(array[i].value);
  }
  const withOthers = totalOthers.isGreaterThan(0)
    ? [
        ...array.slice(0, nbMax || array.length),
        {
          label: "other",
          value: totalOthers,
          color: "black",
        },
      ]
    : array;

  const data = withOthers.reduce((result, item) => {
    result[item.label] = {
      value: item.value,
      color: item.color,
    };
    return result;
  }, {});

  const renderLegends = () => {
    const items = [];
    Object.keys(data).forEach(key => {
      const percentage = (100 * data[key].value) / total;
      items.push(
        <Box horizontal flow={10} align="center" key={key}>
          <Square color={data[key].color} />
          <Text>
            {key} - {Math.round(percentage * 100) / 100}%
          </Text>
        </Box>,
      );
    });
    return items;
  };

  const accountsWithBalance = accountsConnection.edges
    .map(e => e.node)
    .some(a => a.balance.isGreaterThan(0));

  const isErc20Present = accountsConnection.edges
    .map(e => e.node)
    .find(a => a.account_type === "Erc20");

  return (
    <Widget title="Assets distribution">
      <Card align="center">
        {accountsConnection.edges.length === 0 ? (
          <Box grow align="center" justify="center">
            <Text color={colors.textLight}>No accounts.</Text>
          </Box>
        ) : !accountsWithBalance ? (
          <Text color={colors.textLight}>No balance.</Text>
        ) : (
          <>
            <Box horizontal align="center" flow={40}>
              <PieChart data={data} size={300} />
              <Box flow={20}>{renderLegends()}</Box>
            </Box>
            {isErc20Present && (
              <InfoBox type="info">
                <Text i18nKey="adminDashboard:assetDistributionWidget.infoErc20" />
              </InfoBox>
            )}
          </>
        )}
      </Card>
    </Widget>
  );
}

export default connectWidget(
  connect(mapStateToProps)(AssetsDistributionWidget),
  {
    height: 370,
    queries: {
      accountsConnection: SearchAccounts,
    },
    propsToQueryParams: () => ({
      meta_status: "APPROVED",
    }),
  },
);

function resolveFrom(account: Account) {
  if (account.account_type === "Erc20") {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (!token) return null;
    return token;
  }
  const currency = getCryptoCurrencyById(account.currency);
  if (!currency) return null;
  return currency;
}

const Square = styled.div`
  background-color: ${p => p.color};
  border-radius: 4px;
  width: 20px;
  height: 20px;
`;
