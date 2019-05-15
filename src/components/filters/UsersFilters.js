// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldText,
  FieldUserRole,
  FieldStatuses,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { UserStatus } from "data/types";

const statuses: UserStatus[] = [
  "ACTIVE",
  "REVOKED",
  "PENDING_APPROVAL",
  "PENDING_REVOCATION",
  "PENDING_REGISTRATION",
];

export default function UsersFilters(props: FieldsGroupProps) {
  const { ...p } = props;
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find users" subtitle="Find users" {...p}>
      <FieldText title="Name" queryKey="name" placeholder="Name" />
      <FieldUserRole />
      <FieldText title="User ID" queryKey="id" placeholder="User ID" />
      <FieldStatuses statuses={statuses} placeholder={t("common:userStatus")} />
    </FiltersCard>
  );
}
