import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Overscroll extends Component {
  componentDidMount() {
    this.original.addEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    this.copy.scrollTop = this.original.scrollTop;
  };

  render() {
    const height = this.props.height;
    const overscroll = this.props.overscrollSize;
    const background = this.props.background;

    return (
      <div
        className="overscroll"
        style={{
          position: 'relative',
          margin: `-${overscroll}px 0`,
        }}
      >
        <div
          className="copy"
          ref={(node) => { this.copy = node; }}
          style={{
            position: 'absolute',
            filter: 'blur(3px)',
            overflow: 'hidden',
            width: 'calc(100% - 12px)',
            top: `-${overscroll}px`,
            padding: `${overscroll}px 0 ${(overscroll * 2)}px`,
            height: `${height}px`,
          }}
        >
          {this.props.children}
        </div>
        <div
          className="original"
          ref={(node) => { this.original = node; }}
          style={{
            position: 'relative',
            overflowY: 'auto',
            margin: `${overscroll}px 0`,
            height: `${height}px`,
            background,
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Overscroll;

Overscroll.propTypes = {
  height: PropTypes.number.isRequired,
  overscrollSize: PropTypes.number.isRequired,
  background: PropTypes.string.isRequired,
};
