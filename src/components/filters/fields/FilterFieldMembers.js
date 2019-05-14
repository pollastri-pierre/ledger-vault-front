// @flow

import React from "react";

import type { FieldProps } from "components/filters/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { User } from "data/types";

import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import { FieldSelect } from "components/filters";
import { WrappableFieldLoading } from "components/filters/generic/WrappableField";

type Props = FieldProps & {
  users: Connection<User>,
};

function FilterFieldMembers(props: Props) {
  const { users, ...p } = props;
  const members = users.edges.map(u => u.node);
  const options = members.map(u => ({
    label: u.username,
    value: u.id,
  }));
  return (
    <FieldSelect title="Members" queryKey="member" options={options} {...p} />
  );
}

export default connectData(FilterFieldMembers, {
  RenderLoading: WrappableFieldLoading,
  queries: {
    users: UsersQuery,
  },
  propsToQueryParams: () => ({
    role: "OPERATOR",
  }),
});
