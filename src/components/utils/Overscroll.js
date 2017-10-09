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

    // this.interval = setInterval(this.resize, 1000);
  }

  componentWillUnmount() {
    // clearInterval(this.interval);
  }

  onScroll = () => {
    this.copy.scrollTop = this.original.scrollTop;
  };

  resize = () => {
    if (this.node) {
      let parent = this.node.parentNode;

      while (parent.clientHeight === 0) {
        parent = parent.parentNode;
      }

      if (this.node.clientHeight !== parent.clientHeight) {
        this.setState({ height: parent.clientHeight});
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
        ref={(node) => {this.node = node }}
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
              // opacity: 0.5,
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
  // height: PropTypes.number.isRequired,
  overscrollSize: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};
