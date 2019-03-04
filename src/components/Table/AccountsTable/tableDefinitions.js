// @flow

export const accountsTableDefault = [
  {
    header: {
      label: "Name",
      align: "left",
      sortable: true
    },
    body: {
      prop: "name",
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
  },
  {
    header: {
      label: "CounterValue",
      align: "right",
      sortable: false
    },
    body: {
      prop: "countervalue",
      align: "right"
    }
  },
  {
    header: {
      label: "Balance",
      align: "right",
      sortable: true
    },
    body: {
      prop: "balance",
      align: "right"
    }
  }
];

// NOTE: just an example
export const accountsTableCustom1 = [
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
      label: "Status",
      align: "left",
      sortable: false
    },
    body: {
      prop: "status",
      align: "left"
    }
  },
  {
    header: {
      label: "Name",
      align: "left",
      sortable: false
    },
    body: {
      prop: "name",
      align: "left"
    }
  }
];
