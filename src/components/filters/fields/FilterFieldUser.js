// @flow

import React from "react";

import type { FieldProps } from "components/filters/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { User } from "data/types";

import connectData from "restlay/connectData";
import SearchUsers from "api/queries/SearchUsers";
import { FieldSelect } from "components/filters";
import { WrappableFieldLoading } from "components/filters/generic/WrappableField";

type Props = FieldProps & {
  usersConnection: Connection<User>,
};

const noOptionsMessage = () => "No groups";

function FilterFieldUser(props: Props) {
  const { usersConnection, ...p } = props;
  const users = usersConnection.edges.map((u) => u.node);
  const options = users.map((u) => ({ label: u.username, value: u.id }));
  return (
    <FieldSelect
      title="Users"
      queryKey="user"
      options={options}
      closeMenuOnSelect={false}
      controlShouldRenderValue={false}
      hideSelectedOptions={false}
      withCheckboxes
      width={200}
      noOptionsMessage={noOptionsMessage}
      {...p}
    />
  );
}

export default connectData(FilterFieldUser, {
  RenderLoading: () => <WrappableFieldLoading width={200} />,
  queries: {
    usersConnection: SearchUsers,
  },
  propsToQueryParams: () => ({
    pageSize: -1,
    status: ["ACTIVE"],
    role: ["OPERATOR"],
  }),
});
