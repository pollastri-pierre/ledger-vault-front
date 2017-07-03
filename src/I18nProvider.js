import { Children, Component } from 'react';
import PropTypes from 'prop-types';
import Polyglot from 'node-polyglot';

import messages from './messages';

class I18nProvider extends Component {
  getChildContext() {
    const { locale } = this.props;
    const polyglot = new Polyglot({
      locale,
      phrases: messages[locale],
    });

    const translate = polyglot.t.bind(polyglot);

    return { locale, translate };
  }

  render() {
    return Children.only(this.props.children);
  }
}

I18nProvider.childContextTypes = {
  locale: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
};

I18nProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default I18nProvider;
