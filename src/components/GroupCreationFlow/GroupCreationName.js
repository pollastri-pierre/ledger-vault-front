// @flow
import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import InputField from "components/InputField";
import Box from "components/base/Box";

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
    const { payload, t } = this.props;
    return (
      <Box>
        <InputField
          value={payload.name}
          autoFocus
          onChange={this.handleChangeName}
          {...inputProps}
          placeholder={t("group:create.name_placeholder")}
        />
      </Box>
    );
  }
}

export default translate()(GroupCreationName);
