import React from 'react';
import PropTypes from 'prop-types';
import translate from './translate';

import './Menu.css';

function Menu(props) {
  const t = props.translate;

  return (
    <div className="Menu">
      <ul className="main-menu">
        <li><a href="/"><i className="material-icons">home</i> {t('menu.dashboard')}</a></li>
        <li><a href="/new"><i className="material-icons">add</i> {t('menu.newOperation')}</a></li>
        <li><a href="/pending"><i className="material-icons">format_align_left</i> {t('menu.pendingRequests')}</a> <span className="menu-badge">2</span></li>
        <li><a href="/search"><i className="material-icons">search</i> {t('menu.search')}</a></li>
      </ul>
    </div>
  );
}

Menu.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default translate(Menu);
