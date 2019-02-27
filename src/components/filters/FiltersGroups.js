// @flow

import React, { PureComponent } from "react";

import FiltersCard from "./FiltersCard";
import FieldText from "./fields/FilterFieldText";

type Props = {
  query: string,
  onChange: string => void
};

class FiltersGroups extends PureComponent<Props> {
  render() {
    const { ...props } = this.props;
    return (
      <FiltersCard title="Filters" subtitle="Find groups" {...props}>
        <FieldText title="Name" queryKey="name" placeholder="Group name" />
      </FiltersCard>
    );
  }
}

export default FiltersGroups;
