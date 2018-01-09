//@flow
import React from "react";
import PropTypes from "prop-types";

export function Row(props: *) {
  return (
    <div className="row" {...props}>
      {props.children}
    </div>
  );
}

Row.propTypes = {
  children: PropTypes.node
};

Row.defaultProps = {
  children: ""
};

export function Col(props: *) {
  return (
    <div className={`col-${props.width}`} {...props}>
      {props.children}
    </div>
  );
}

Col.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number
};

Col.defaultProps = {
  children: "",
  width: 1
};
