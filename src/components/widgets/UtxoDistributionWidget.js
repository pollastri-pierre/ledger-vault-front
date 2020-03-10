// @flow

import React from "react";
import noop from "lodash/noop";
import { useTranslation } from "react-i18next";

import AccountUtxoDistributionQuery from "api/queries/AccountUtxoDistributionQuery";
import type { UTXORange, Account } from "data/types";
import Card from "components/base/Card";
import Box from "components/base/Box";
import { UtxosDistributionTable } from "components/Table";
import Widget, { connectWidget } from "./Widget";

type Props = { account: Account, utxoDistribution: UTXORange[] };

function UtxoDistributionWidget(props: Props) {
  const { t } = useTranslation();
  return (
    <Widget title={t("accountView:utxos.utxo_distro_title")}>
      <Card style={{ padding: 5 }}>
        <Box>
          <UtxosDistributionTable
            account={props.account}
            data={props.utxoDistribution}
            onRowClick={noop}
          />
        </Box>
      </Card>
    </Widget>
  );
}

export default connectWidget(UtxoDistributionWidget, {
  height: 450,
  queries: {
    utxoDistribution: AccountUtxoDistributionQuery,
  },
  propsToQueryParams: props => ({
    accountId: props.account.id,
  }),
});
