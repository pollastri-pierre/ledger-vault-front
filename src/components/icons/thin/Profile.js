import React from 'react';
import PropTypes from 'prop-types';

function Profile(props) {
  const style = {
    fill: 'none',
    stroke: props.color,
    strokeMiterlimit: '10',
    strokeWidth: '2px',
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.8 32" {...props}>
      <title>profile</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <g id="User">
            <path d="M13.9,18.1A12.9,12.9,0,0,0,1,31H26.8A12.9,12.9,0,0,0,13.9,18.1Z" style={style} />
            <circle cx="13.9" cy="9.55" r="8.55" style={style} />
          </g>
        </g>
      </g>
    </svg>
  );
}

Profile.propTypes = {
  color: PropTypes.string,
};

Profile.defaultProps = {
  color: '#000',
};

export default Profile;
