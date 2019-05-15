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
} from "components/filters";

type Props = FieldsGroupProps & {
  accounts: Account[],
};

type StatusOption = {
  value: TransactionStatus,
  label: string,
};

const statuses: StatusOption[] = [
  { value: "SUBMITTED", label: "Confirmed" },
  { value: "ABORTED", label: "Aborted" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
];

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
      <FieldSelect
        title="Status"
        queryKey="status"
        options={statuses}
        placeholder={t("common:transactionStatus")}
      />
      <FieldDate />
      <FieldText title="Label" queryKey="label" placeholder="Label" />
    </FiltersCard>
  );
}
