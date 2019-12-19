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
      label: "Members",
      align: "left",
    },
    body: {
      prop: "members",
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
