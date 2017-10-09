import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

function Alert(props) {
  const { title, children, theme: themeName, ...newProps } = props;
  let iconDiv = '';
  let titleDiv = '';
  const theme = {};
  const bodyStyle = {
    height: 'initial',
    lineHeight: 'initial',
    padding: '40px',
  };

  switch (themeName) {
    case 'success':
      theme.color = '#41ccb4';
      theme.icon = 'check';
      break;

    case 'error':
      theme.color = '#ea2e49';
      theme.icon = 'close';
      break;

    default:
      theme.color = false;
      theme.icon = false;
      break;
  }

  if (theme.color) {
    bodyStyle.backgroundColor = theme.color;
  }

  if (theme.icon) {
    iconDiv = (
      <div style={{ fontSize: '38px', lineHeight: 0, marginRight: '30px' }} >
        <i className="material-icons">{theme.icon}</i>
      </div>
    );
  }

  if (title) {
    titleDiv = (
      <div
        className="top-message-title"
        style={{
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '15px',
        }}
      >
        {title}
      </div>
    );
  }

  const content = (
    <div style={{ display: 'flex' }}>
      {iconDiv}
      <div>
        {titleDiv}
        <div className="top-message-body">{children}</div>
      </div>
    </div>
  );

  return (
      <Snackbar
        {...newProps}
        className={`top-message ${props.className}`}
        style={{
          top: 0,
          bottom: 'auto',
          transform: props.open ? 'translate3d(-50%, 0, 0)' : 'translate3d(-50%, -100%, 0)',
          ...props.style,
        }}
        bodyStyle={bodyStyle}
        contentStyle={{
          fontSize: '11px',
        }}
        message={content}
      />
  );
}

Alert.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.shape({}),
  open: PropTypes.bool,
  theme: PropTypes.string,
  title: PropTypes.node,
};

Alert.defaultProps = {
  className: '',
  children: '',
  style: {},
  open: false,
  theme: '',
  title: '',
};

export default Alert;

