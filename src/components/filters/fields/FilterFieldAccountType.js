// @flow
import React from "react";
import omit from "lodash/omit";
import type { ObjectParameters } from "query-string";

import SelectAccountType, { options } from "components/SelectAccountType";
import { WrappableField, defaultFieldProps } from "components/filters";
import type { AccountTypeOption } from "components/SelectAccountType";
import type { FieldProps } from "components/filters";

const QUERY_KEY = "account_type";

const FilterFieldAccountAccountType = (
  props: FieldProps = defaultFieldProps,
) => {
  const { updateQueryParams, queryParams } = props;
  const onChange = (val: ?AccountTypeOption) => {
    if (val) {
      updateQueryParams(QUERY_KEY, val.value);
    } else {
      updateQueryParams(q => {
        q = omit(q, [QUERY_KEY]);
        return q;
      });
    }
  };

  const value = resolveAccountType(queryParams);

  return (
    <WrappableField
      label="Account type"
      isActive={!!value}
      closeOnChange={value}
      RenderCollapsed={() => (value ? value.value : null)}
    >
      <SelectAccountType
        autoFocus
        openMenuOnFocus={!value}
        onChange={onChange}
        value={value || null}
      />
    </WrappableField>
  );
};

export default FilterFieldAccountAccountType;

function resolveAccountType(queryParams: ObjectParameters): ?AccountTypeOption {
  if (!queryParams.account_type) return null;
  return options.find(o => o.value === queryParams.account_type);
}
