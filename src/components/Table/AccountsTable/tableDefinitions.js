// @flow

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
