//@flow

import React from "react";

type Props = {
  labelFor: string,
  checked: boolean,
  handleInputChange?: (checked: boolean) => void
};
function Checkbox(props: Props) {
  const { labelFor, checked, handleInputChange } = props;

  return (
    <div
      className="slidebox"
      onClick={
        handleInputChange
          ? (e: *) => {
              e.preventDefault();
              handleInputChange(e.target.checked);
            }
          : null
      }
    >
      <input type="checkbox" id={labelFor} checked={checked} />
      <label htmlFor={labelFor} />
      <span />
    </div>
  );
}

Checkbox.defaultProps = {
  checked: false
};

export default Checkbox;
