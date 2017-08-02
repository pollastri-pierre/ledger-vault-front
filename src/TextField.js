import React from 'react';
import PropTypes from 'prop-types';
import MUITextField from 'material-ui/TextField';

import './TextField.css';

function TextField(props) {
  const underlineColor = props.errorText ? '#ea2e49' : '#cccccc';

  return (
    <MUITextField
      {...props}
      className={`vlt-textfield ${props.className}`}
      fullWidth={props.fullWidth}
      style={{
        fontSize: 'inherit',
        height: 'initial',
        lineHeight: 'initial',
        ...props.style,
      }}
      inputStyle={{
        fontSize: 'inherit',
        ...props.inputStyle,
      }}
      underlineFocusStyle={{
        borderBottom: `1px solid ${underlineColor}`,
        bottom: 0,
        ...props.underlineFocusStyle,
      }}
      underlineStyle={{
        borderColor: '#eeeeee',
        bottom: 0,
        ...props.underlineStyle,
      }}
      hintStyle={{
        fontSize: 'inherit',
        bottom: 'initial',
        ...props.hintStyle,
      }}
      errorStyle={{
        color: '#ea2e49',
      }}
    />
  );
}

TextField.propTypes = {
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  style: PropTypes.shape({}),
  inputStyle: PropTypes.shape({}),
  underlineFocusStyle: PropTypes.shape({}),
  underlineStyle: PropTypes.shape({}),
  hintStyle: PropTypes.shape({}),
  errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

TextField.defaultProps = {
  className: '',
  fullWidth: true,
  style: {},
  inputStyle: {},
  underlineFocusStyle: {},
  underlineStyle: {},
  hintStyle: {},
  errorText: false,
};

export default TextField;
