import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import translate from '../../decorators/Translate';

import './Menu.css';

function Menu(props, context) {
  const t = context.translate;

  return (
    <div className="Menu">
      <ul className="main-menu">
        <li><Link to="/"><i className="material-icons">home</i> {t('menu.dashboard')}</Link></li>
        <li><Link to="/new"><i className="material-icons">add</i> {t('menu.newOperation')}</Link></li>
        <li><Link to="/pending"><i className="material-icons">format_align_left</i> {t('menu.pendingRequests')}</Link> <span className="menu-badge">2</span></li>
        <li><Link to="/search"><i className="material-icons">search</i> {t('menu.search')}</Link></li>

        {/* Test page */}
        <li><Link to="/sandbox"><i className="material-icons">beach_access</i> sandbox</Link></li>
        <li><Link to="/operations"><i className="material-icons">beach_access</i> operations</Link></li>
      </ul>
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired,
};

export default Menu;
