import React, { Component } from 'react';

class Section extends Component {
  render() {
    const { title, titleRight, children } = this.props;
    return (
      <div className="bloc">
        <header>
          <h3>{title}</h3>
          <span className="title-right">{titleRight}</span>
        </header>
        <div className="bloc-content">{children}</div>
      </div>
    );
  }
}

export default Section;
