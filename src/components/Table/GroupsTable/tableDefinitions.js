// @flow

export const groupsTableDefault = [
  {
    header: {
      label: "Name",
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
      sortable: false,
    },
    body: {
      prop: "status",
      align: "left",
    },
  },
  {
    header: {
      label: "Members",
      align: "left",
      sortable: false,
    },
    body: {
      prop: "members",
      align: "left",
    },
  },
];
