// @flow

export const requestsTableDefault = [
  {
    header: {
      label: "Date",
      align: "left",
      sortable: true,
    },
    body: {
      prop: "created_on",
      align: "left",
    },
  },
  {
    header: {
      label: "Activity",
      align: "left",
      sortable: true,
    },
    body: {
      prop: "type",
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
];
