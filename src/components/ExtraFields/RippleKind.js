// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import type { EditProps } from "bridge/types";
import type { Transaction as RippleTransaction } from "bridge/RippleBridge";
import Box from "components/base/Box";
import { InputText, Label } from "components/base/form";

const isNumber = c => {
  const code = c.charCodeAt(0);
  return code >= 48 && code <= 57;
};

export const hints = [
  {
    key: "nbChars",
    label: "Up to 9 digits",
    check: (v: string) => v.length <= 9,
  },
  {
    key: "onlyDigits",
    label: "Contains only numbers",
    check: (v: string) => v.split("").every(isNumber),
  },
];

const ExtraFieldsRipple = (props: EditProps<RippleTransaction>) => {
  const { transaction, onChangeTransaction } = props;
  const { t } = useTranslation();

  const handleChangeDestinationTag = destinationTag => {
    onChangeTransaction({ ...transaction, destinationTag });
  };

  return (
    <Box width={240}>
      <Label>{t("transactionCreation:steps.amount.destinationTag")}</Label>
      <InputText
        data-test="tag"
        value={transaction.destinationTag}
        onChange={handleChangeDestinationTag}
        placeholder={t("transactionCreation:steps.amount.destinationTagDesc")}
        maxLength={9}
        hints={hints}
      />
    </Box>
  );
};

export default ExtraFieldsRipple;
