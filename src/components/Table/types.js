// @flow

export type TableDefinition = TableItem[];

export type TableItem = {
  header: TableHeader,
  body: TableBody,
};

type TableHeader = {
  label: React$Node,
  align: "left" | "right",
  sortable?: boolean,
  sortFirst?: "asc" | "desc",
};

type TableBody = {
  prop: string,
  align: string,
  size?: string,
};
