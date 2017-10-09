import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Overscroll extends Component {
  constructor(props) {
    super(props);

    this.state = { height: 0 };
  }

  componentDidMount() {
    this.original.addEventListener('scroll', this.onScroll);
    this.resize();

    this.interval = setInterval(this.resize, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onScroll = () => {
    this.copy.scrollTop = this.original.scrollTop;
  };

  resize = () => {
    if (this.node) {
      if (!this.parent) {
        this.parent = this.node.parentNode;

        while (this.parent.clientHeight === 0) {
          this.parent = this.parent.parentNode;
        }
      }

      if (this.node.clientHeight !== this.parent.clientHeight) {
        this.setState({ height: this.parent.clientHeight });
      }
    }
  };

  render() {
    const height = this.state.height;
    const overscrollSize = this.props.overscrollSize;
    const backgroundColor = this.props.backgroundColor;

    return (
      <div
        className="overscroll"
        style={{ position: 'relative' }}
        ref={(node) => { this.node = node; }}
      >
        <div
          className="copy"
          ref={(node) => { this.copy = node; }}
          style={{
            position: 'absolute',
            filter: 'blur(3px)',
            overflow: 'hidden',
            width: 'calc(100% - 15px)',
            top: `-${(overscrollSize - 6)}px`,
            paddingTop: `${overscrollSize - 6}px `,
            paddingBottom: `${overscrollSize}px`,
            height: `${(height - 6)}px`,
          }}
        >
          {this.props.children}
        </div>
        <div
          className="wrapper"
          style={{
            position: 'relative',
          }}
        >
          <div
            className="overscroll-top"
            style={{
              position: 'absolute',
              width: '100%',
              top: `-${overscrollSize}px`,
              height: `${overscrollSize}px`,
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.5), white)',
            }}
          />
          <div
            className="original"
            ref={(node) => { this.original = node; }}
            style={{
              position: 'relative',
              overflowY: 'auto',
              height: `${height}px`,
              background: backgroundColor,
              margin: '0 -6px',
              padding: '0 6px',
            }}
          >
            {this.props.children}
          </div>
          <div
            className="overscroll-bottom"
            style={{
              position: 'absolute',
              width: '100%',
              bottom: `-${overscrollSize}px`,
              height: `${overscrollSize}px`,
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), white)',
            }}
          />
        </div>
      </div>
    );
  }
}

export default Overscroll;

Overscroll.propTypes = {
  overscrollSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
};

Overscroll.defaultProps = {
  overscrollSize: '40',
  backgroundColor: 'white',
  children: '',
};
