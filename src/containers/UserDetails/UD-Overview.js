// @flow
import React, { PureComponent } from "react";
import type { Member } from "data/types";
import { Trans } from "react-i18next";
import DateFormat from "components/DateFormat";
import LineRow from "components/LineRow";
import Box from "components/base/Box";

type Props = {
  user: Member
};

class UserDetailsOverview extends PureComponent<Props> {
  render() {
    const { user } = this.props;
    return (
      <Box pt={20}>
        <LineRow label={<Trans i18nKey="userDetails:username" />}>
          {user.username}
        </LineRow>
        <LineRow label={<Trans i18nKey="userDetails:role" />}>
          {user.role}
        </LineRow>
        <LineRow label={<Trans i18nKey="userDetails:userID" />}>
          {user.id}
        </LineRow>
        <LineRow label={<Trans i18nKey="userDetails:date" />}>
          <DateFormat format="ddd D MMM, h:mmA" date={user.created_on} />
        </LineRow>
        <LineRow label={<Trans i18nKey="userDetails:url" />}>N/A</LineRow>
      </Box>
    );
  }
}

export default UserDetailsOverview;
