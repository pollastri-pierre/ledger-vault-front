// @flow
import React, { PureComponent } from "react";
import type { Member } from "data/types";
import { Trans } from "react-i18next";
import DateFormat from "components/DateFormat";
import LineRow from "components/LineRow";
import Box from "components/base/Box";

type Props = {
  member: Member
};

class MemberDetailsOverview extends PureComponent<Props> {
  render() {
    const { member } = this.props;
    return (
      <Box pt={20}>
        <LineRow label={<Trans i18nKey="memberDetails:username" />}>
          {member.username}
        </LineRow>
        <LineRow label={<Trans i18nKey="memberDetails:role" />}>
          {member.role}
        </LineRow>
        <LineRow label={<Trans i18nKey="memberDetails:userID" />}>
          {member.id}
        </LineRow>
        <LineRow label={<Trans i18nKey="memberDetails:date" />}>
          <DateFormat format="ddd D MMM, h:mmA" date={member.created_on} />
        </LineRow>
        <LineRow label={<Trans i18nKey="memberDetails:url" />}>N/A</LineRow>
      </Box>
    );
  }
}

export default MemberDetailsOverview;
