// @flow

import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useTranslation } from "react-i18next";

import Button from "components/base/Button";
import { FaRedo } from "react-icons/fa";

const RecalculateFees = ({ onClick }: { onClick: Function }) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t("transactionCreation:steps.account.fees.recompute")}>
      <Button type="link" size="tiny" noSpinner square onClick={onClick}>
        <FaRedo size={8} onClick={onClick} />
      </Button>
    </Tooltip>
  );
};

export default RecalculateFees;
