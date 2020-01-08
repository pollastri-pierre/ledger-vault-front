// @flow

import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { ModalBody } from "components/base/Modal";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import type { Account } from "data/types";

type Props = {
  account: Account,
  onClose: () => void,
};

function AccountXpub(props: Props) {
  const { account, onClose } = props;
  const [checked, setCheck] = useState(false);
  const [copied, setCopy] = useState(false);
  const onCheck = () => {
    setCheck(!checked);
  };
  const onCopy = () => {
    setCopy(true);
  };

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopy(false);
      }, 1e3);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [copied, setCopy]);

  // TODO: redo the way it looks: colors, add copy timeout for text, etc
  return (
    <ModalBody onClose={onClose} pb={0} width={400} flow={20} align="center">
      <InfoBox type="warning" withIcon>
        <Text i18nKey="accountSettings:advanced.warningXpub" />
      </InfoBox>
      <Box horizontal align="center" flow={40}>
        <Box horizontal align="center" onClick={onCheck} cursor="pointer">
          <Checkbox checked={checked} />
          <Text i18nKey="accountSettings:advanced.understand_xpub" />
        </Box>
        <CopyToClipboard text={account.xpub} onCopy={onCopy}>
          <Button
            size="small"
            type="outline"
            variant="info"
            disabled={!checked || copied}
          >
            <Text>{copied ? "Copied!" : "Copy"} </Text>
          </Button>
        </CopyToClipboard>
      </Box>
    </ModalBody>
  );
}

export default AccountXpub;
