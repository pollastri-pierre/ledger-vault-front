// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldStatuses,
  FieldText,
  FieldAccount,
} from "components/filters";
import { WhitelistStatusMap } from "data/types";
import type { FieldsGroupProps } from "components/filters/types";
import type { WhitelistStatus } from "data/types";

export const defaultStatuses: WhitelistStatus[] = [];

const statuses: WhitelistStatus[] = [
  ...defaultStatuses,
  ...Object.keys(WhitelistStatusMap),
];

export default function WhitelistsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find tasks" subtitle="Find tasks" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:requestStatus")}
        queryKey="status"
      />
      <FieldText title="Name" queryKey="name" placeholder="name" />
      <FieldText title="Address" queryKey="address" placeholder="address" />
      <FieldAccount />
    </FiltersCard>
  );
}
