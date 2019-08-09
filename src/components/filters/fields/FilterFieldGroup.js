// @flow

import React from "react";

import type { FieldProps } from "components/filters/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { Group } from "data/types";

import connectData from "restlay/connectData";
import SearchGroups from "api/queries/SearchGroups";
import { FieldSelect } from "components/filters";
import { WrappableFieldLoading } from "components/filters/generic/WrappableField";

type Props = FieldProps & {
  groupsConnection: Connection<Group>,
};

const noOptionsMessage = () => "No groups";

function FilterFieldGroup(props: Props) {
  const { groupsConnection, ...p } = props;
  const groups = groupsConnection.edges.map(u => u.node);
  const options = groups.map(u => ({ label: u.name, value: u.id }));
  return (
    <FieldSelect
      title="Group"
      queryKey="group"
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

export default connectData(FilterFieldGroup, {
  RenderLoading: () => <WrappableFieldLoading width={200} />,
  queries: {
    groupsConnection: SearchGroups,
  },
  propsToQueryParams: () => ({
    pageSize: -1,
    status: ["ACTIVE"],
  }),
});
