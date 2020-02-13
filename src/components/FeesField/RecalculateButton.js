// @flow

import React from "react";
import Tooltip from "components/base/Tooltip";
import { useTranslation } from "react-i18next";

import Button from "components/base/Button";
import { FaRedo } from "react-icons/fa";

const RecalculateFees = ({ onClick }: { onClick: Function }) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t("transactionCreation:steps.account.fees.recompute")}>
      <Button type="link" size="tiny" noSpinner square onClick={onClick}>
        <FaRedo size={8} onClick={onClick} />
      </Button>
    </Tooltip>
  );
};

export default RecalculateFees;
