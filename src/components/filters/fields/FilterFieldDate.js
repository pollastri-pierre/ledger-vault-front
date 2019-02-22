// @flow

import React, { PureComponent } from "react";
import DatePicker from "material-ui-pickers/DatePicker";
import moment from "moment";

import type { ObjectParameter } from "query-string";

import Box from "components/base/Box";
import FieldTitle from "./FieldTitle";

import { defaultFieldProps } from "../FiltersCard";
import type { FieldProps } from "../FiltersCard";

type Props = FieldProps;

class FilterFieldDate extends PureComponent<Props> {
  static defaultProps = defaultFieldProps;

  handleChange = (field: string, d: moment) => {
    const { updateQuery } = this.props;
    const value = d ? d.format("YYYY-MM-DD") : null;
    updateQuery(field, value);
  };

  handleChangeStartDate = (d: moment) => this.handleChange("start", d);

  handleChangeEndDate = (d: moment) => this.handleChange("end", d);

  render() {
    const { query } = this.props;

    const startDate = resolveDate(query.start);
    const endDate = resolveDate(query.end);
    const isActive = !!startDate || !!endDate;

    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>Date</FieldTitle>
        <Box horizontal flow={20}>
          <Box flex={1}>
            <DatePicker
              disableFuture
              autoOk
              clearable
              placeholder="Start date"
              value={startDate}
              onChange={this.handleChangeStartDate}
              clearLabel="clear"
              rightArrowIcon=">"
              leftArrowIcon="<"
              cancelLabel="cancel"
            />
          </Box>
          <Box flex={1}>
            <DatePicker
              initialFocusedDate={startDate}
              disableFuture
              autoOk
              clearable
              placeholder="End date"
              value={endDate}
              onChange={this.handleChangeEndDate}
              clearLabel="clear"
              rightArrowIcon=">"
              leftArrowIcon="<"
              cancelLabel="cancel"
            />
          </Box>
        </Box>
      </Box>
    );
  }
}

function resolveDate(v: ObjectParameter | $ReadOnlyArray<ObjectParameter>) {
  if (typeof v !== "string") return null;
  return new Date(v);
}

export default FilterFieldDate;
