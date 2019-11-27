/* @flow */

import React from "react";

import Text from "components/base/Text";
import colors from "shared/colors";

type Props = {
  inline?: boolean,
};
export default function NotApplicableText(props: Props) {
  const { inline } = props;
  return (
    <Text
      inline={inline}
      i18nKey="common:not_applicable"
      color={colors.mediumGrey}
    />
  );
}
