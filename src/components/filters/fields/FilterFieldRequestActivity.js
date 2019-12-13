// @flow

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  RequestActivityTypeDefsGroup,
  RequestActivityTypeDefsAccount,
  RequestActivityTypeDefsUser,
  RequestActivityTypeDefsOrganization,
  RequestActivityTypeDefsWhitelist,
} from "data/types";

import type { RequestActivityType } from "data/types";

import { FieldSelect } from "components/filters";
import type { FieldProps } from "components/filters";

const opts = [
  {
    label: "Users",
    options: Object.keys(RequestActivityTypeDefsUser),
  },
  {
    label: "Group",
    options: Object.keys(RequestActivityTypeDefsGroup),
  },
  {
    label: "Accounts",
    options: Object.keys(RequestActivityTypeDefsAccount),
  },
  {
    label: "Whitelists",
    options: Object.keys(RequestActivityTypeDefsWhitelist),
  },
  {
    label: "Other",
    options: Object.keys(RequestActivityTypeDefsOrganization),
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
