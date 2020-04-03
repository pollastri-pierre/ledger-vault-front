// @flow
import React from "react";

import { FiltersCard } from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";

export default function UtxosFilters(props: FieldsGroupProps) {
  return <FiltersCard title="find UTXOs" {...props} />;
}
