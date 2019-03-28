// @flow
import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import InputField from "components/InputField";
import Box from "components/base/Box";

import type { Translate } from "data/types";
import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {
  t: Translate,
};

class GroupCreationDescription extends PureComponent<Props> {
  handleChangeName = (description: string) => {
    const { updatePayload } = this.props;
    updatePayload({ description });
  };

  render() {
    const { payload, t } = this.props;
    return (
      <Box>
        <InputField
          value={payload.description}
          autoFocus
          onChange={this.handleChangeName}
          placeholder={t("group:create.desc_placeholder")}
        />
      </Box>
    );
  }
}

export default translate()(GroupCreationDescription);
