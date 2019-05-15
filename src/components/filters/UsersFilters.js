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

export const defaultStatuses: UserStatus[] = [
  "ACTIVE",
  "PENDING_APPROVAL",
  "PENDING_REVOCATION",
  "PENDING_REGISTRATION",
];

const statuses: UserStatus[] = [...defaultStatuses, "REVOKED"];

export default function UsersFilters(props: FieldsGroupProps) {
  const { ...p } = props;
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find users" subtitle="Find users" {...p}>
      <FieldStatuses statuses={statuses} placeholder={t("common:userStatus")} />
      <FieldText title="Name" queryKey="name" placeholder="Name" />
      <FieldUserRole />
      <FieldText title="User ID" queryKey="id" placeholder="User ID" />
    </FiltersCard>
  );
}
