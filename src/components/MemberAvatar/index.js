import React from "react";
import PropTypes from "prop-types";
import People from "../icons/thin/Profile";
import "./index.css";

function Avatar(props) {
  const { url, width, height, ...rest } = props;

  return (
    <span className="member-avatar">
      {url && url !== "" ? (
        <img src={props.url} alt="Profile avatar" />
      ) : (
        <People width={width} height={height} color="white" />
      )}
    </span>
  );
}

Avatar.defaultProps = {
  url: "",
  width: "14px",
  height: "16px"
};

Avatar.propTypes = {
  url: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
};

export default Avatar;
