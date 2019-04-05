// @flow
import React, { PureComponent } from "react";
import type { Group } from "data/types";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import MemberName from "components/base/MemberName";
import LineRow from "components/LineRow";
import DateFormat from "components/DateFormat";

type Props = {
  group: Group,
};

class GroupDetailsDetails extends PureComponent<Props> {
  render() {
    const { group } = this.props;
    return (
      <Box pt={20}>
        <LineRow label={<Trans i18nKey="group:details.name" />}>
          {group.name}
        </LineRow>
        <LineRow label={<Trans i18nKey="group:details.description" />}>
          {group.description}
        </LineRow>
        <LineRow label={<Trans i18nKey="group:details.at" />}>
          <DateFormat date={group.created_on} />
        </LineRow>
        {group.created_by && (
          <LineRow label={<Trans i18nKey="group:details.by" />}>
            <MemberName member={group.created_by} />
          </LineRow>
        )}
      </Box>
    );
  }
}

export default GroupDetailsDetails;
