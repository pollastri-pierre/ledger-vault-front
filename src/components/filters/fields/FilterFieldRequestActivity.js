// @flow

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { RequestActivityType } from "data/types";

import { FieldSelect } from "components/filters";
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
  const { t } = useTranslation();

  const options = useMemo(() => buildOptions(opts, t), [t]);

  return (
    <FieldSelect
      title={t("common:type")}
      placeholder={t("common:requestActivity")}
      queryKey="type"
      options={options}
      closeMenuOnSelect={false}
      controlShouldRenderValue={false}
      hideSelectedOptions={false}
      withCheckboxes
      width={200}
      {...props}
    />
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
