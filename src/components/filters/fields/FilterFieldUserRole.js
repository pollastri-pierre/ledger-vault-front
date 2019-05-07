// @flow
import React from "react";
import omit from "lodash/omit";
import type { ObjectParameters } from "query-string";

import Text from "components/base/Text";
import SelectUserRole, { options } from "components/SelectUserRole";
import { WrappableField } from "components/filters";
import type { UserRoleOption } from "components/SelectUserRole";
import type { FieldProps } from "components/filters/types";

const QUERY_KEY = "role";

const FilterFieldUserRole = (props: FieldProps) => {
  const { updateQueryParams, queryParams } = props;
  const onChange = (val: ?UserRoleOption) => {
    if (val) {
      updateQueryParams(QUERY_KEY, val.value);
    } else {
      updateQueryParams(q => {
        q = omit(q, [QUERY_KEY]);
        return q;
      });
    }
  };

  const value = resolveUserRole(queryParams);

  return (
    <WrappableField
      label="User role"
      isActive={!!value}
      closeOnChange={value}
      RenderCollapsed={() => (value ? <Text>{value.label}</Text> : null)}
    >
      <SelectUserRole
        autoFocus
        openMenuOnFocus={!value}
        onChange={onChange}
        value={value || null}
      />
    </WrappableField>
  );
};

export default FilterFieldUserRole;

function resolveUserRole(queryParams: ObjectParameters): ?UserRoleOption {
  if (!queryParams.role) return null;
  return options.find(o => o.value === queryParams[QUERY_KEY]);
}
