// @flow

import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Box from "components/base/Box";
import Button from "components/base/Button";
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
  // TODO: redo the way it looks: colors, add copy timeout for text, etc
  return (
    <Box width={400} p={40} flow={20} align="center">
      <InfoBox type="warning" withIcon>
        <Text i18nKey="accountSettings:advanced.warningXpub" />
      </InfoBox>
      <Box horizontal align="center">
        <Box horizontal align="center" onClick={onCheck}>
          <Text
            size="small"
            i18nKey="accountSettings:advanced.understand_xpub"
          />
          <Checkbox checked={checked} />
        </Box>
        <CopyToClipboard text={account.xpub} onCopy={onCopy}>
          <Button
            size="small"
            type="outline"
            variant="info"
            disabled={!checked}
          >
            <Text>{copied ? "Copied" : "Copy"} </Text>
          </Button>
        </CopyToClipboard>
      </Box>
    </Box>
  );
}

export default AccountXpub;
