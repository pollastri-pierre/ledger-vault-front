// @flow

import React, { PureComponent } from "react";

import {
  FiltersCard,
  FieldRequestStatuses,
  FieldRequestActivity,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";

class RequestsFilters extends PureComponent<FieldsGroupProps> {
  render() {
    const { ...props } = this.props;
    return (
      <FiltersCard title="Find tasks" subtitle="Find tasks" {...props}>
        <FieldRequestStatuses />
        <FieldRequestActivity />
      </FiltersCard>
    );
  }
}

export default RequestsFilters;
