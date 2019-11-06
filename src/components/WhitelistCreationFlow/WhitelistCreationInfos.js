// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import Box from "components/base/Box";
import { InputText, Label } from "components/base/form";
import type { Translate } from "data/types";
import type { WhitelistCreationStepProps } from "./types";

type Props = WhitelistCreationStepProps & {
  t: Translate,
};

const WhitelistCreationInfos = (props: Props) => {
  const { t, payload, updatePayload } = props;
  const handleChangeName = (name: string) => updatePayload({ name });
  const handleChangeDesc = (description: string) =>
    updatePayload({ description });
  return (
    <Box flow={20}>
      <Box>
        <Label>{t("whitelists:create.name_placeholder")}</Label>
        <InputText
          data-test="whitelist_name"
          value={payload.name}
          autoFocus
          onChange={handleChangeName}
          maxLength={19}
          onlyAscii
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
};

export default withTranslation()(WhitelistCreationInfos);
