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
      label: "Available balance",
      align: "right",
    },
    body: {
      prop: "available_balance",
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
  {
    header: {
      label: "Status",
      align: "right",
      sortable: true,
    },
    body: {
      prop: "status",
      align: "right",
    },
  },
  {
    header: {
      label: "More",
      align: "center",
    },
    body: {
      prop: "details",
      align: "center",
      size: "small",
    },
  },
];

export const accountsIsOperatorTableDefault = [
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
      label: "Available balance",
      align: "right",
    },
    body: {
      prop: "available_balance",
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
  {
    header: {
      label: <Trans i18nKey="accountView:permission" />,
      align: "right",
    },
    body: {
      prop: "approver_role",
      align: "right",
    },
  },
  {
    header: {
      label: "Status",
      align: "right",
      sortable: true,
    },
    body: {
      prop: "status",
      align: "right",
    },
  },
  {
    header: {
      label: "More",
      align: "center",
    },
    body: {
      prop: "details",
      align: "center",
      size: "small",
    },
  },
];
