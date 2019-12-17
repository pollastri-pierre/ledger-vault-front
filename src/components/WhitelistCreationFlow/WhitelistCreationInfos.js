// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import Box from "components/base/Box";
import { InputText, Label, Form } from "components/base/form";
import { maxLengthNonAsciiHints } from "components/base/hints";
import type { WhitelistCreationStepProps } from "./types";

const WHITELIST_NAME_LENGTH = 19;

const WhitelistCreationInfos = (props: WhitelistCreationStepProps) => {
  const { payload, updatePayload, onEnter } = props;
  const { t } = useTranslation();
  const handleChangeName = (name: string) => updatePayload({ name });
  const handleChangeDesc = (description: string) =>
    updatePayload({ description });
  const inner = (
    <Box flow={20}>
      <Box>
        <Label>{t("whitelists:create.name_placeholder")}</Label>
        <InputText
          data-test="whitelist_name"
          value={payload.name}
          autoFocus
          onChange={handleChangeName}
          maxLength={WHITELIST_NAME_LENGTH}
          onlyAscii
          hints={maxLengthNonAsciiHints(WHITELIST_NAME_LENGTH)}
          placeholder={t("whitelists:create.name_placeholder")}
        />
      </Box>
      <Box>
        <Label>{t("whitelists:create.desc_placeholder")}</Label>
        <InputText
          data-test="whitelist_description"
          value={payload.description}
          onChange={handleChangeDesc}
          maxLength={200}
          placeholder={t("whitelists:create.desc_placeholder")}
        />
      </Box>
    </Box>
  );
  return <Form onSubmit={onEnter}>{inner}</Form>;
};

export default WhitelistCreationInfos;
