// @flow
import React from "react";
import Text from "components/base/Text";

const styles = {
  role: {
    textTransform: "capitalize",
  },
};
export default ({ userRole }: { userRole: string }) => (
  <Text style={styles.role} i18nKey={`userDetails:${userRole}`} />
);
