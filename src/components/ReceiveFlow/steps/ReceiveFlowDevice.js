// @flow

import React, { PureComponent } from "react";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";

import {
  FaPowerOff,
  FaUsb,
  FaUserSecret,
  FaRegHandPointUp,
} from "react-icons/fa";

import { U2F_PATH, U2F_TIMEOUT } from "device";
import { getPublicKey } from "device/interface";

import colors from "shared/colors";
import Box from "components/base/Box";
import Card from "components/base/Card";
import Text from "components/base/Text";
import LedgerBlue from "components/icons/LedgerBlue";
import type { ReceiveFlowStepProps } from "../types";

type Props = ReceiveFlowStepProps;

class ReceiveFlowDevice extends PureComponent<Props> {
  componentDidMount() {
    this.isOnVaultApp();
  }

  isOnVaultApp = async () => {
    const { payload, updatePayload } = this.props;
    const { selectedAccount } = payload;
    if (selectedAccount) {
      try {
        let transport;
        if (process.env.NODE_ENV !== "e2e" && !window.config.SOFTWARE_DEVICE) {
          transport = await LedgerTransportU2F.create(90000000, 90000000);
        }
        await getPublicKey(transport, U2F_PATH, false);
        updatePayload({ isOnVaultApp: true });
      } catch (error) {
        console.error(error);
        if (error && error.id === U2F_TIMEOUT) {
          this.isOnVaultApp();
        }
      }
    }
  };

  render() {
    return (
      <Box horizontal flow={20}>
        <Box align="center" justify="center" m={20}>
          <LedgerBlue width={90} height={180} />
        </Box>
        <Box grow flow={15}>
          <InstructionRow title="receive:device_step1" icon={<FaPowerOff />} />
          <InstructionRow title="receive:device_step2" icon={<FaUsb />} />
          <InstructionRow
            title="receive:device_step3"
            icon={<FaUserSecret />}
          />
          <InstructionRow
            title="receive:device_step4"
            icon={<FaRegHandPointUp />}
          />
        </Box>
      </Box>
    );
  }
}

export default ReceiveFlowDevice;

function InstructionRow({ title, icon }: { title: string, icon: React$Node }) {
  return (
    <Card bg="#fdfdfd">
      <Box flow={15} horizontal>
        <Box justify="center" align="center">
          {icon}
        </Box>
        <Text color={colors.lead} i18nKey={title} />
      </Box>
    </Card>
  );
}
