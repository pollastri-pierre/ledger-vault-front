//@flow
import "./TotalBalanceFilter.css";
type Filter = { title: string, key: string };
export const TotalBalanceFilters: Filter[] = [
  { title: "yesterday", key: "yesterday" },
  { title: "a week ago", key: "week" },
  { title: "a month ago", key: "month" }
];

// FIXME move it somewhere else (it's no longer a component)
