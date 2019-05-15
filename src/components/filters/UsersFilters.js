// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldText,
  FieldUserRole,
  FieldSelect,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { UserStatus } from "data/types";

type StatusOption = {
  value: UserStatus,
  label: string,
};

const statuses: StatusOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "REVOKED", label: "Revoked" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
  { value: "PENDING_REVOCATION", label: "Pending revocation" },
  { value: "PENDING_REGISTRATION", label: "Pending registration" },
];

export default function UsersFilters(props: FieldsGroupProps) {
  const { ...p } = props;
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find users" subtitle="Find users" {...p}>
      <FieldText title="Name" queryKey="name" placeholder="Name" />
      <FieldUserRole />
      <FieldText title="User ID" queryKey="id" placeholder="User ID" />
      <FieldSelect
        title="Status"
        queryKey="status"
        options={statuses}
        placeholder={t("common:userStatus")}
      />
    </FiltersCard>
  );
}
