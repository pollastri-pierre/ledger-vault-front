// @flow

import React, { PureComponent } from "react";

import { FiltersCard, FieldText } from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";

class FiltersGroups extends PureComponent<FieldsGroupProps> {
  render() {
    const { ...props } = this.props;
    return (
      <FiltersCard title="Find groups" subtitle="Find groups" {...props}>
        <FieldText title="Name" queryKey="name" placeholder="Group name" />
      </FiltersCard>
    );
  }
}

export default FiltersGroups;
