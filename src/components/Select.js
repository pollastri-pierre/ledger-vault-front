// @flow

import React, { PureComponent } from "react";
import ReactSelect from "react-select";
import AsyncReactSelect from "react-select/lib/Async";

type Option = {
  value: *,
  label: string
};

type Props = {
  async?: boolean,
  options?: Option[]
};

class Select extends PureComponent<Props> {
  render() {
    const { async, ...props } = this.props;
    const Comp = async ? AsyncReactSelect : ReactSelect;
    return <Comp {...props} />;
  }
}

export default Select;
