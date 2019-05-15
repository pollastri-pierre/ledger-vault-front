// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import type { Account, TransactionStatus } from "data/types";
import type { FieldsGroupProps } from "components/filters/types";

import {
  FiltersCard,
  FieldCurrency,
  FieldAccounts,
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
];

const statuses: TransactionStatus[] = [...defaultStatuses, "ABORTED"];

const txTypes = [
  { value: "SEND", label: "Send" },
  { value: "RECEIVE", label: "Receive" },
];

export default function TransactionsFilters(props: Props) {
  const { accounts, ...p } = props;
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find transactions" subtitle="Find transactions" {...p}>
      <FieldSelect
        single
        title="Transaction type"
        queryKey="type"
        options={txTypes}
      />
      <FieldCurrency />
      <FieldAccounts accounts={accounts} />
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:transactionStatus")}
      />
      <FieldDate />
      <FieldText title="Label" queryKey="label" placeholder="Label" />
    </FiltersCard>
  );
}
