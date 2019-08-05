// @flow
import React from "react";
import { Trans } from "react-i18next";

export const accountsTableDefault = [
  {
    header: {
      label: "Account name",
      align: "left",
      sortable: true,
    },
    body: {
      prop: "name",
      align: "left",
    },
  },
  {
    header: {
      label: "Status",
      align: "left",
      sortable: true,
    },
    body: {
      prop: "status",
      align: "left",
    },
  },
  {
    header: {
      label: "Countervalue",
      align: "right",
      sortable: false,
    },
    body: {
      prop: "countervalue",
      align: "right",
    },
  },
  {
    header: {
      label: "Balance",
      align: "right",
    },
    body: {
      prop: "balance",
      align: "right",
    },
  },
];

export const roleColumn = {
  header: {
    label: <Trans i18nKey="accountView:permission" />,
    align: "right",
  },
  body: {
    prop: "approver_role",
    align: "right",
  },
};
