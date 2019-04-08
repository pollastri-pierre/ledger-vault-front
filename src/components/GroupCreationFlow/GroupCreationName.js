// @flow
import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import Box from "components/base/Box";
import Disabled from "components/Disabled";
import { InputText, Label } from "components/base/form";

import type { Translate } from "data/types";
import type { GroupCreationStepProps } from "./types";

const inputProps = {
  maxLength: 19,
  onlyAscii: true,
};

type Props = GroupCreationStepProps & {
  t: Translate,
};

class GroupCreationName extends PureComponent<Props> {
  handleChangeName = (name: string) => {
    const { updatePayload } = this.props;
    updatePayload({ name });
  };

  render() {
    const { payload, t, isEditMode } = this.props;
    return (
      <Disabled disabled={isEditMode}>
        <Box>
          <Label>{t("group:create.name_placeholder")}</Label>
          <InputText
            value={payload.name}
            autoFocus
            disabled={isEditMode}
            onChange={this.handleChangeName}
            {...inputProps}
            placeholder={t("group:create.name_placeholder")}
          />
        </Box>
      </Disabled>
    );
  }
}

export default translate()(GroupCreationName);