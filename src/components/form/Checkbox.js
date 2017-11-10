//@flow

import React from "react";
import "./Checkbox.css";

type Props = {
  labelFor: string,
  handleInputChange?: (checked: boolean) => void,
  checked?: boolean
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
  handleInputChange: () => {},
  checked: false
};

export default Checkbox;
