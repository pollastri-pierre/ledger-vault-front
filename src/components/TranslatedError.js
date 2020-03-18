// @flow
// Convention:
// - errors we throw on our app will use a different error.name per error type
// - an error can have parameters, to use them, just use field of the Error object, that's what we give to `t()`
// - returned value is intentially not styled (is universal). wrap this in whatever you need

import { PureComponent } from "react";
import { withTranslation } from "react-i18next";

import { extractErrorTitle, extractErrorContent } from "utils/errors";
import type { Translate } from "data/types";

type Props = {
  error: ?Error,
  t: Translate,
  field: "title" | "description",
};

class TranslatedError extends PureComponent<Props> {
  static defaultProps = {
    field: "title",
  };

  render() {
    const { t, error, field } = this.props;
    if (!error) return null;
    if (typeof error !== "object") {
      // this case should not happen (it is supposed to be a ?Error)
      if (typeof error === "string") {
        return error; // TMP in case still used somewhere
      }
      return null;
    }
    // $FlowFixMe
    const arg: Object = Object.assign({ message: error.message }, error); // eslint-disable-line prefer-object-spread
    if (error.name) {
      const translation = t(`errors:${error.name}.${field}`, arg);
      if (translation !== `${error.name}.${field}`) {
        // It is translated
        return translation;
      }
    }

    // $FlowFixMe
    if (error.json) {
      if (field === "title") return extractErrorTitle(error);
      if (field === "description") return extractErrorContent(error);
    }

    return error.message || t(`errors:generic.${field}`, arg);
  }
}

export default withTranslation()(TranslatedError);
