import React from 'react';
import PropTypes from 'prop-types';
import People from '../icons/thin/Profile';

function Avatar(props) {
  const { url, width, height, ...rest } = props;
  if (url && url !== '') {
    return (
      <img src={props.url} {...rest} alt="Profile avatar" />
    );
  }

  return (
    <People width={width} height={height} {...rest} />
  );
}

Avatar.defaultProps = {
  url: '',
  width: '13.5px',
  height: '15px',
};

Avatar.propTypes = {
  url: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Avatar;
