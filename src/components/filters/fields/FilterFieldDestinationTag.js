// @flow

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import noop from "lodash/noop";
import type { ObjectParameters } from "query-string";

import connectData from "restlay/connectData";
import type { Account } from "data/types";
import SearchAccounts from "api/queries/SearchAccounts";
import { FieldText } from "components/filters";
import type { FieldProps } from "components/filters/types";
import { WrappableFieldLoading } from "components/filters/generic/WrappableField";
import type { Connection } from "restlay/ConnectionQuery";
import { InputText } from "components/base/form";
import Tooltip from "components/base/Tooltip";

type Props = FieldProps & {
  accountsConnection: Connection<Account>,
  queryParams: ObjectParameters,
};

function FilterFieldDestinationTag(props: Props) {
  const { t } = useTranslation();
  const { accountsConnection, queryParams } = props;
  const accounts = useMemo(() => accountsConnection.edges.map(u => u.node), [
    accountsConnection,
  ]);

  const canFilter = useMemo(() => {
    if (queryParams.account) {
      const selectedAccounts = getSelectedAccounts(accounts, queryParams);
      return selectedAccounts.some(isRipple);
    }
    if (queryParams.currency) {
      const selectedCurrencies = getSelectedCurrencies(queryParams);
      return selectedCurrencies.includes("ripple");
    }
    return accounts.some(isRipple);
  }, [accounts, queryParams]);

  if (!canFilter)
    return (
      <Tooltip content={t("transaction:info.noXrpTransaction")}>
        <InputText
          width={200}
          disabled
          placeholder="Destination tag"
          value=""
          onChange={noop}
        />
      </Tooltip>
    );

  return (
    <FieldText
      {...props}
      width={200}
      title="Destination tag"
      queryKey="destination_tag"
      placeholder="Destination tag"
    />
  );
}

const isRipple = account => account.account_type === "Ripple";

const getSelectedAccounts = (accounts, queryParams) => {
  const isSelected = account => {
    if (Array.isArray(queryParams.account)) {
      return queryParams.account.some(
        id => id.toString() === account.id.toString(),
      );
    }
    return queryParams.account.toString() === account.id.toString();
  };
  return accounts.filter(isSelected);
};

const getSelectedCurrencies = queryParams => {
  if (!queryParams.currency) return [];
  if (Array.isArray(queryParams.currency)) return queryParams.currency;
  return [queryParams.currency];
};

export default connectData(FilterFieldDestinationTag, {
  RenderLoading: () => <WrappableFieldLoading width={200} />,
  queries: {
    accountsConnection: SearchAccounts,
  },
  propsToQueryParams: () => ({
    pageSize: -1,
    meta_status: "APPROVED",
  }),
});
