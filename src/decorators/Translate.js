import React from 'react';
import PropTypes from 'prop-types';
import Polyglot from 'node-polyglot';
import { connect } from 'react-redux';
import messages from '../messages';

const mapStateToProps = (state) => ({
  locale: state.locale
});

export default (BaseComponent) => {
  const LocalizedComponent = (props) => {

    const { locale } = props;

    const polyglot = new Polyglot({
      locale,
      phrases: messages[locale],
    });

    const translate = polyglot.t.bind(polyglot);

    return (
      <BaseComponent
        translate={translate}
        locale={locale}
        {...props}
      />
    );
  };

  return connect(mapStateToProps)(LocalizedComponent);
};
