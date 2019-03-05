// @flow

import React, { PureComponent } from "react";

import { FiltersCard, FieldText } from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";

class FiltersOperations extends PureComponent<FieldsGroupProps> {
  render() {
    const { ...props } = this.props;
    return (
      <FiltersCard title="Find accounts" subtitle="Find accounts" {...props}>
        <FieldText title="Name" queryKey="name" placeholder="Name" />
      </FiltersCard>
    );
  }
}

export default FiltersOperations;
