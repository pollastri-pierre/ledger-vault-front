// @flow

import React from "react";

import type { FieldProps } from "components/filters/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { Account } from "data/types";

import connectData from "restlay/connectData";
import SearchAccounts from "api/queries/SearchAccounts";
import { FieldSelect } from "components/filters";
import { WrappableFieldLoading } from "components/filters/generic/WrappableField";

type Props = FieldProps & {
  accountsConnection: Connection<Account>,
  queryKey?: string,
  title?: string,
};

const noOptionsMessage = () => "No accounts";

function FilterFieldUsersInAccount(props: Props) {
  const { accountsConnection, queryKey, title, ...p } = props;
  const accounts = accountsConnection.edges.map(u => u.node);
  const options = accounts.map(u => ({ label: u.name, value: u.id }));
  return (
    <FieldSelect
      title={title || "Account"}
      queryKey={queryKey || "account"}
      options={options}
      closeMenuOnSelect={false}
      controlShouldRenderValue={false}
      hideSelectedOptions={false}
      withCheckboxes
      width={300}
      noOptionsMessage={noOptionsMessage}
      {...p}
    />
  );
}

export default connectData(FilterFieldUsersInAccount, {
  RenderLoading: () => <WrappableFieldLoading width={300} />,
  queries: {
    accountsConnection: SearchAccounts,
  },
  propsToQueryParams: () => ({
    pageSize: -1,
    meta_status: "APPROVED",
  }),
});
