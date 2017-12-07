//@flow
import React from "react";
import People from "../icons/thin/Profile";

function Avatar(props: { url: ?string, width: number, height: number }) {
  const { url, width, height } = props;
  return (
    <span className="member-avatar">
      {url ? (
        <img src={props.url} alt="Profile avatar" />
      ) : (
        <People width={width + "px"} height={height + "px"} color="white" />
      )}
    </span>
  );
}

Avatar.defaultProps = {
  url: "",
  width: 14,
  height: 16
};

export default Avatar;
