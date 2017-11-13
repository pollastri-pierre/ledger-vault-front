//@flow
import React from "react";
import People from "../icons/thin/Profile";

function Avatar(props: { url: ?string, width: number, height: number }) {
  const { url, width, height, ...rest } = props;
  if (url) {
    return <img src={props.url} {...rest} alt="Profile avatar" />;
  }
  return <People width={width} height={height} {...rest} color="white" />;
}

Avatar.defaultProps = {
  width: 13.5,
  height: 15
};

export default Avatar;
