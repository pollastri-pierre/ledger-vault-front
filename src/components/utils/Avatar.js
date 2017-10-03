import React from 'react';
import People from '../icons/PeopleThin';

function Avatar(props) {
  const { url, width, height, ...rest } = props;
  if (url) {
    return (
      <img src={props.url} {...rest} />
    );
  }

  return (
    <People width={width} height={height} {...rest} />
  );
}

export default Avatar;
