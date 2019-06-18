// @flow

export const usersTableDefault = [
  {
    header: {
      label: "Username",
      align: "left",
      sortable: true,
    },
    body: {
      prop: "username",
      align: "left",
    },
  },
  {
    header: {
      label: "User role",
      align: "left",
      sortable: false,
    },
    body: {
      prop: "role",
      align: "left",
    },
  },
  {
    header: {
      label: "User ID",
      align: "left",
      sortable: false,
    },
    body: {
      prop: "userid",
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
];
