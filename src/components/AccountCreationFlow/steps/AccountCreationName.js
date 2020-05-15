// @flow

import { useTranslation } from "react-i18next";
import React from "react";

import Disabled from "components/Disabled";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { maxLengthNonAsciiHints, uniqName } from "components/base/hints";
import { InputText, Label, Form } from "components/base/form";
import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

import type { AccountCreationStepProps } from "../types";

import ERC20RenderName from "./ERC20RenderName";

const ACCOUNT_NAME_LENGTH = 19;

const inputProps = {
  maxLength: ACCOUNT_NAME_LENGTH,
  onlyAscii: true,
};

export default function AccountCreationOptions(
  props: AccountCreationStepProps,
) {
  const { t } = useTranslation();
  const {
    payload,
    updatePayload,
    allAccounts,
    isEditMode,
    account,
    onEnter,
  } = props;
  const { currency } = payload;

  const handleChangeName = (name: string) => {
    const { updatePayload } = props;
    updatePayload({ name });
  };

  let inner = null;

  const isDisabled =
    isEditMode &&
    account.status !== "ACTIVE" &&
    account.status !== "VIEW_ONLY" &&
    account.status !== "MIGRATED";

  const hints = isEditMode
    ? [...maxLengthNonAsciiHints(ACCOUNT_NAME_LENGTH)]
    : [
        ...maxLengthNonAsciiHints(ACCOUNT_NAME_LENGTH),
        ...uniqName(
          payload.name,
          allAccounts.edges.map((e) => e.node.name),
        ),
      ];

  if (payload.erc20token) {
    inner = (
      <ERC20RenderName
        isEditMode={isEditMode}
        payload={payload}
        allAccounts={allAccounts}
        updatePayload={updatePayload}
      />
    );
  } else {
    if (!currency) return null;
    const AccountCurIcon = getCryptoCurrencyIcon(currency);
    const IconLeft = AccountCurIcon
      ? () => <AccountCurIcon color={currency.color} size={16} />
      : undefined;

    inner = (
      <Box flow={20}>
        <InfoBox type="info" withIcon>
          <Text i18nKey="accountCreation:steps.name.warning" />
        </InfoBox>
        <Box>
          <Label>{t("newAccount:options.name")}</Label>
          <InputText
            data-test="account_name"
            value={payload.name}
            disabled={isDisabled}
            autoFocus
            onChange={handleChangeName}
            hints={hints}
            placeholder={t("newAccount:options.acc_name_placeholder")}
            {...inputProps}
            IconLeft={IconLeft}
          />
        </Box>
      </Box>
    );
  }
  return (
    <Disabled disabled={isDisabled}>
      <Form onSubmit={onEnter}>{inner}</Form>
    </Disabled>
  );
}
