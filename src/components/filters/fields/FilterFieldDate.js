// @flow

import React, { PureComponent } from "react";
import DatePicker from "material-ui-pickers/DatePicker";
import moment from "moment";

import type { ObjectParameter } from "query-string";

import Box from "components/base/Box";
import Text from "components/base/Text";

import type { FieldProps } from "../FiltersCard";

type Props = FieldProps;

class FilterFieldDate extends PureComponent<Props> {
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

    return (
      <Box flow={5}>
        <Text small uppercase>
          Date
        </Text>
        <Box horizontal flow={20}>
          <Box flex={1}>
            <DatePicker
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
