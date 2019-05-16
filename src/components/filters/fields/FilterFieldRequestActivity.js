// @flow

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ObjectParameters, ObjectParameter } from "query-string";

import Select from "components/base/Select";
import Text from "components/base/Text";
import type { RequestActivityType } from "data/types";

import { WrappableField } from "components/filters";
import type { FieldProps } from "components/filters";

const opts = [
  {
    label: "Users",
    options: ["CREATE_ADMIN", "CREATE_OPERATOR", "REVOKE_USER"],
  },
  {
    label: "Group",
    options: ["CREATE_GROUP", "EDIT_GROUP", "REVOKE_GROUP"],
  },
  {
    label: "Accounts",
    options: [
      "CREATE_ACCOUNT",
      "EDIT_ACCOUNT",
      "MIGRATE_ACCOUNT",
      "REVOKE_ACCOUNT",
    ],
  },
  {
    label: "Other",
    options: ["UPDATE_QUORUM"],
  },
];

function FilterFieldRequestActivity(props: FieldProps) {
  const { queryParams, updateQueryParams } = props;
  const { t } = useTranslation();

  const options = useMemo(() => buildOptions(opts, t), [t]);

  const Collapsed = () => (
    <Text>{requestActivity.map(a => a.label).join(", ")}</Text>
  );

  const handleChange = (opt: Option[]) => {
    updateQueryParams("type", opt && opt.length ? opt.map(o => o.value) : null);
  };

  const resolveOptions = (arr: $ReadOnlyArray<ObjectParameter>): Option[] => {
    return arr
      .map(s => {
        for (const group of options) {
          const e = group.options.find(o => o.value === s);
          if (e) return e;
        }
        return null;
      })
      .filter(Boolean);
  };

  const resolveRequestActivity = (queryParams: ObjectParameters): Option[] => {
    if (!queryParams.type) return [];
    if (typeof queryParams.type === "string")
      return resolveOptions([queryParams.type]);
    if (Array.isArray(queryParams.type))
      return resolveOptions(queryParams.type);
    return [];
  };

  const requestActivity = resolveRequestActivity(queryParams);
  const isActive = !!requestActivity.length;

  return (
    <WrappableField
      label="Activity"
      isActive={isActive}
      RenderCollapsed={Collapsed}
    >
      <Select
        isMulti
        placeholder={t("common:requestActivity")}
        isClearable
        autoFocus
        openMenuOnFocus
        closeMenuOnSelect={false}
        value={requestActivity}
        onChange={handleChange}
        // $FlowFixMe
        options={options}
      />
    </WrappableField>
  );
}

type Option = {
  value: RequestActivityType,
  label: string,
};

type RawSection = {
  label: string,
  options: RequestActivityType[],
};

type Section = {
  label: string,
  options: Option[],
};

function buildOptions(arr: RawSection[], t): Section[] {
  return arr.map(section => {
    return {
      label: section.label,
      options: section.options.map(s => ({
        value: s,
        label: t(`request:type.${s}`),
      })),
    };
  });
}

export default FilterFieldRequestActivity;
