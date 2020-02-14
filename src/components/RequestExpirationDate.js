// @flow

import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Tooltip from "components/base/Tooltip";
import { FaHourglassHalf } from "react-icons/fa";

import colors from "shared/colors";

type Props = {
  expirationDate: Date,
  displayDayBefore?: number,
};

const DEFAULT_DAY = 1;

const RequestExpirationDate = ({ expirationDate, displayDayBefore }: Props) => {
  const { t } = useTranslation();
  const diff = moment(expirationDate).diff(moment(new Date()), "days");
  const dayBefore = displayDayBefore || DEFAULT_DAY;
  const remainingTime = moment(expirationDate).toNow(true);
  return (
    <Tooltip content={t("request:expire_in", { count: remainingTime })}>
      <FaHourglassHalf
        size={17}
        color={diff <= dayBefore ? colors.grenade : colors.lightGrey}
      />
    </Tooltip>
  );
};

export default RequestExpirationDate;
