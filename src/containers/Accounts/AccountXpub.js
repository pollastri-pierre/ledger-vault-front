// @flow

import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { CopyToClipboard } from "react-copy-to-clipboard";

import colors, { darken } from "shared/colors";
import Box from "components/base/Box";
import Button from "components/legacy/Button";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import type { Account } from "data/types";

type Props = {
  account: Account,
};

function AccountXpub(props: Props) {
  const { account } = props;
  const [checked, setCheck] = useState(false);
  const [copied, setCopy] = useState(false);
  const onCheck = () => {
    setCheck(!checked);
  };
  const onCopy = () => {
    setCopy(true);
  };
  return (
    <Box width={400} p={40} flow={20} align="center">
      <InfoBox type="warning" withIcon>
        <Text i18nKey="accountSettings:advanced.warningXpub" />
      </InfoBox>
      <Box horizontal align="center">
        <Box horizontal align="center" onClick={onCheck}>
          <Text small i18nKey="accountSettings:advanced.understand_xpub" />
          <Checkbox checked={checked} />
        </Box>
        <CopyToClipboard text={account.xpub} onCopy={onCopy}>
          {copied ? (
            <Button
              onClick={() => {}}
              size="tiny"
              disabled={!checked}
              variant="filled"
              customColor={darken(colors.light_orange, 0.2)}
            >
              copied
            </Button>
          ) : (
            <Button
              onClick={() => {}}
              size="tiny"
              variant="filled"
              disabled={!checked}
              customColor={colors.light_orange}
            >
              {" "}
              copy
            </Button>
          )}
        </CopyToClipboard>
      </Box>
    </Box>
  );
}

export default AccountXpub;
