//@flow
import React from "react";
import Polyglot from "node-polyglot";
import { connect } from "react-redux";
import messages from "../messages";

const mapStateToProps = state => ({
  locale: state.locale
});

export default function Translate(
  BaseComponent: React$ComponentType<*>
): React$ComponentType<*> {
  const LocalizedComponent = (props: *) => {
    const { locale } = props;
    const polyglot = new Polyglot({
      locale,
      phrases: messages[locale]
    });
    const translate = polyglot.t.bind(polyglot);
    return <BaseComponent translate={translate} locale={locale} {...props} />;
  };

  // $FlowFixMe
  return connect(mapStateToProps)(LocalizedComponent);
}
