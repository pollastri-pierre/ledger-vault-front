// @flow

export const usersTableDefault = [
  {
    header: {
      label: "Date",
      align: "left",
      sortable: true
    },
    body: {
      prop: "date",
      align: "left"
    }
  },
  {
    header: {
      label: "Username",
      align: "left",
      sortable: false
    },
    body: {
      prop: "username",
      align: "left"
    }
  },
  {
    header: {
      label: "Role",
      align: "left",
      sortable: false
    },
    body: {
      prop: "role",
      align: "left"
    }
  },
  {
    header: {
      label: "User ID",
      align: "left",
      sortable: false
    },
    body: {
      prop: "userid",
      align: "left"
    }
  },
  {
    header: {
      label: "Status",
      align: "left",
      sortable: false
    },
    body: {
      prop: "status",
      align: "left"
    }
  }
];
