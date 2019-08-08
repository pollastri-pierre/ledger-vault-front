// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import type { Account, TransactionStatus } from "data/types";
import type { FieldsGroupProps } from "components/filters/types";

import {
  FiltersCard,
  FieldCurrency,
  FieldAccount,
  FieldDate,
  FieldText,
  FieldSelect,
  FieldStatuses,
} from "components/filters";

type Props = FieldsGroupProps & {
  accounts: Account[],
};

export const defaultStatuses: TransactionStatus[] = [
  "SUBMITTED",
  "PENDING_APPROVAL",
  "BLOCKED",
  "ABORTED",
];

const statuses: TransactionStatus[] = [...defaultStatuses];

const txTypes = [
  { value: "SEND", label: "Send" },
  { value: "RECEIVE", label: "Receive" },
];

export default function TransactionsFilters(props: Props) {
  const { t } = useTranslation();
  return (
    <FiltersCard
      title="Find transactions"
      subtitle="Find transactions"
      {...props}
    >
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:transactionStatus")}
      />
      <FieldSelect
        single
        title="Type"
        placeholder="Transaction type"
        queryKey="type"
        options={txTypes}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        withCheckboxes
        width={180}
      />
      <FieldCurrency />
      <FieldAccount />
      <FieldDate />
      <FieldText title="Label" queryKey="label" placeholder="Label" />
    </FiltersCard>
  );
}
