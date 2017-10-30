import React from "react";
import PropTypes from "prop-types";
import "./Checkbox.css";

function Checkbox(props) {
  const { labelFor, checked, handleInputChange } = props;

  return (
    <div className="slidebox">
      <input
        type="checkbox"
        id={labelFor}
        checked={checked}
        onChange={handleInputChange}
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

Checkbox.propTypes = {
  labelFor: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func,
  checked: PropTypes.bool
};

export default Checkbox;
