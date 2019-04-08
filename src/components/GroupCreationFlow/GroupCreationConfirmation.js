// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import LineRow from "components/LineRow";

import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {};

class GroupCreationConfirmation extends PureComponent<Props> {
  render() {
    const { payload } = this.props;
    return (
      <Box>
        <LineRow label={<Trans i18nKey="group:create.name" />}>
          {payload.name}
        </LineRow>
        <LineRow label={<Trans i18nKey="group:create.description" />}>
          {payload.description}
        </LineRow>
        <LineRow label={<Trans i18nKey="group:create.nb_members" />}>
          {payload.members.length}
        </LineRow>
      </Box>
    );
  }
}

export default GroupCreationConfirmation;
