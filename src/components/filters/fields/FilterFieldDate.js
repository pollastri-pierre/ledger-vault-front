// @flow

import React, { PureComponent } from "react";
import moment from "moment";
import styled from "styled-components";
import { FaInfinity } from "react-icons/fa";

import type { ObjectParameter } from "query-string";

import colors from "shared/colors";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import { WrappableField, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters";

type Props = FieldProps;

const infinity = <FaInfinity color={colors.mediumGrey} />;

class FilterFieldDate extends PureComponent<Props> {
  static defaultProps = defaultFieldProps;

  handleChange = (field: string, e: SyntheticInputEvent<*>) => {
    const { updateQueryParams } = this.props;
    const { value } = e.target;
    let v = value ? moment(value) : null;
    if (v) {
      if (field === "start") {
        v = v.startOf("day");
      }
      if (field === "end") {
        v = v.endOf("day");
      }
      v = v.toISOString();
    }
    updateQueryParams(field, v);
  };

  handleChangeStartDate = (e: SyntheticInputEvent<*>) =>
    this.handleChange("start", e);

  handleChangeEndDate = (e: SyntheticInputEvent<*>) =>
    this.handleChange("end", e);

  Collapsed = () => {
    const { queryParams } = this.props;
    const startDate = resolveDate(queryParams.start);
    const endDate = resolveDate(queryParams.end);
    return (
      <Box horizontal flow={5} align="center">
        {startDate ? <span>{startDate.format("YYYY-MM-DD")}</span> : infinity}
        <span>/</span>
        {endDate ? <span>{endDate.format("YYYY-MM-DD")}</span> : infinity}
      </Box>
    );
  };

  render() {
    const { queryParams } = this.props;

    const startDate = resolveDate(queryParams.start);
    const endDate = resolveDate(queryParams.end);
    const isActive = !!startDate || !!endDate;

    return (
      <WrappableField
        label="Date"
        isActive={isActive}
        RenderCollapsed={this.Collapsed}
      >
        <Box flow={5}>
          <Box horizontal flow={10}>
            <Box flex={1}>
              <Label>Start date</Label>
              <StyledInputDate
                autoFocus
                value={startDate ? startDate.format("YYYY-MM-DD") : ""}
                onChange={this.handleChangeStartDate}
              />
            </Box>
            <Box flex={1}>
              <Label>End date</Label>
              <StyledInputDate
                value={endDate ? endDate.format("YYYY-MM-DD") : ""}
                onChange={this.handleChangeEndDate}
              />
            </Box>
          </Box>
        </Box>
      </WrappableField>
    );
  }
}

const StyledInputDate = styled((p) => <input type="date" {...p} />)`
  height: 40px;
  border-radius: 4px;
  border: 1px solid ${colors.form.border};
  outline: none;
  ::-webkit-datetime-edit {
    padding: 0 10px;
  }
  ::-webkit-inner-spin-button {
    display: none;
  }
  ::-webkit-calendar-picker-indicator {
    padding: 10px;
    margin: 0 5px;
    cursor: pointer;
  }
  &:focus {
    outline: none;
    border-color: ${colors.form.focus};
    box-shadow: ${colors.form.shadow.focus};
  }
`;

function resolveDate(v: ObjectParameter | $ReadOnlyArray<ObjectParameter>) {
  if (typeof v !== "string") return null;
  return moment(v);
}

export default FilterFieldDate;
