// @flow

export type TableDefinition = TableItem[];

export type TableItem = {
  header: TableHeader,
  body: TableBody,
};

type TableHeader = {
  label: string,
  align: string,
  sortable: boolean,
};

type TableBody = {
  prop: string,
  align: string,
};
