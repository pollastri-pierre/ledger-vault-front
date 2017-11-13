//@flow
import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

import "./Tooltip.css";

function Tooltip(props: { className: string }) {
  return (
    <ReactTooltip
      {...props}
      className={`vlt-tooltip ${props.className}`}
      effect="solid"
    />
  );
}

Tooltip.propTypes = {
  className: PropTypes.string
};

Tooltip.defaultProps = {
  className: ""
};

export default Tooltip;
