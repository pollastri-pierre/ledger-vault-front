//@flow

import React from "react";
import "./Checkbox.css";

type Props = {
  labelFor: string,
  checked: boolean,
  handleInputChange?: (checked: boolean) => void
};
function Checkbox(props: Props) {
  const { labelFor, checked, handleInputChange } = props;

  return (
    <div className="slidebox">
      <input
        type="checkbox"
        id={labelFor}
        checked={checked}
        onChange={
          handleInputChange
            ? (e: *) => handleInputChange(e.target.checked)
            : null
        }
      />
      <label htmlFor={labelFor} />
      <span />
    </div>
  );
}

Checkbox.defaultProps = {
  checked: false
};

export default Checkbox;
