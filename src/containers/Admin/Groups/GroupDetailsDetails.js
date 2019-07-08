// @flow
import React, { PureComponent } from "react";
import type { Group } from "data/types";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import LineRow from "components/LineRow";

type Props = {
  group: Group,
};

class GroupDetailsDetails extends PureComponent<Props> {
  render() {
    const { group } = this.props;
    return (
      <Box>
        <LineRow label={<Trans i18nKey="group:details.name" />}>
          {group.name}
        </LineRow>
        <LineRow
          noOverflowHidden
          label={<Trans i18nKey="group:details.description" />}
        >
          {group.description}
        </LineRow>
      </Box>
    );
  }
}

export default GroupDetailsDetails;
