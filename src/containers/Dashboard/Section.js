import React, { Component } from 'react';

class Section extends Component {
  render() {
    const { title, titleRight, children } = this.props;
    return (
      <div className="dashboard-section">
        <header>
          <span className="title">{title}</span>
          <span className="title-right">{titleRight}</span>
        </header>
        {children}
      </div>
    );
  }
}

export default Section;
