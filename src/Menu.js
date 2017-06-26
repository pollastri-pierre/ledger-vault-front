import React from 'react';

import './Menu.css';

function Menu() {
  return (
    <div className="Menu">
      <ul className="main-menu">
        <li><a href="/"><i className="material-icons">home</i> Dashboard</a></li>
        <li><a href="/new"><i className="material-icons">add</i> New operation</a></li>
        <li><a href="/pending"><i className="material-icons">format_align_left</i> Pending requests</a> <span className="menu-badge">2</span></li>
        <li><a href="/search"><i className="material-icons">search</i> Search</a></li>
      </ul>
    </div>
  );
}

export default Menu;
