// @flow

import React from "react";
import moment from "moment";

import Text from "components/base/Text";
import { Trans } from "react-i18next";
import colors from "shared/colors";

type Props = {
  expirationDate: Date,
  displayDayBefore?: number,
};

const DEFAULT_DAY = 1;

const RequestExpirationDate = ({ expirationDate, displayDayBefore }: Props) => {
  const diff = moment(expirationDate).diff(moment(new Date()), "days");
  const dayBefore = displayDayBefore || DEFAULT_DAY;
  if (diff > dayBefore) {
    return null;
  }
  const remainingTime = moment(expirationDate).toNow(true);
  return (
    <Text size="small" italic color={colors.grenade}>
      <Trans
        i18nKey="request:expire_in"
        count={remainingTime}
        values={{ count: remainingTime }}
      />
    </Text>
  );
};

export default RequestExpirationDate;
