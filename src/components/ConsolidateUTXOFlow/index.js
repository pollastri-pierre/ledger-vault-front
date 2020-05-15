// @flow

import React from "react";
import { FaMoneyCheck } from "react-icons/fa";
import { Trans, useTranslation } from "react-i18next";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import connectData from "restlay/connectData";
import Box from "components/base/Box";
import Button from "components/base/Button";

// FIXME change the name of this query which is misleading
import AddressFromDerivationPathQuery from "api/queries/AddressFromDerivationPathQuery";

import { getBridgeForCurrency } from "bridge";
import { CardError } from "components/base/Card";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import AccountQuery from "api/queries/AccountQuery";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";
import AccountUnspentOutputsQuery from "api/queries/AccountUTXOQuery";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import VerifyAddress from "./VerifyAddress";
import VerifyAddressDeviceInteraction from "./VerifyAddressDeviceInteraction";
import ValidateUTXOConsolidation from "./ValidateUTXOConsolidation";
import Consolidate, { calculateTotalAmount } from "./Consolidate";

// FIXME we probably want to fetch this info
const MAX_UTXOS_TO_CONSOLIDATE = 100;

const steps = [
  {
    id: "verify",
    name: "Verify address",
    Cta: VerifyAddressDeviceInteraction,
    Step: VerifyAddress,
  },
  {
    id: "consolidate",
    name: "Consolidate",
    Step: Consolidate,
    requirements: (payload) => payload.hasValidatedAddress,
    Cta: ValidateUTXOConsolidation,
  },
  {
    id: "finish",
    name: <Trans i18nKey="transactionCreation:finish" />,
    hideBack: true,
    Step: () => {
      const { t } = useTranslation();
      return <MultiStepsSuccess title={t("consolidateUTXO:success")} />;
    },
    Cta: ({ onClose }: { onClose?: () => void }) => {
      const { t } = useTranslation();
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            {t("common:done")}
          </Button>
        </Box>
      );
    },
  },
];

export default connectData(
  ({ close, account, freshAddress, accountUTXOs, restlay }) => {
    const expectedNbUTXOs = Math.min(
      accountUTXOs.edges.length - 1,
      MAX_UTXOS_TO_CONSOLIDATE,
    );
    const totalAmount = calculateTotalAmount(accountUTXOs, expectedNbUTXOs);
    const bitcoinBridge = getBridgeForCurrency(
      getCryptoCurrencyById("bitcoin"),
    );
    const tx = bitcoinBridge.createTransaction(account);
    const transaction = {
      ...tx,
      expectedNbUTXOs,
      utxoPickingStrategy: "MERGE_OUTPUTS",
      amount: totalAmount,
      recipient: freshAddress[0].address,
      note: { title: `Consolidation - ${account.name}`, content: "" },
    };
    const payload = {
      transaction,
      hasValidatedAddress: false,
    };
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaMoneyCheck}
          title="Consolidate UTXOs"
          payloadToCompareTo={payload}
          initialPayload={payload}
          additionalProps={{
            account,
            bridge: bitcoinBridge,
            // FIXME it's not a fresh address it's the address 0
            freshAddress: freshAddress[0],
            accountUTXOs,
            restlay,
          }}
          steps={steps}
          onClose={close}
        />
      </GrowingCard>
    );
  },
  {
    queries: {
      account: AccountQuery,
      // FIXME
      // - name of the prop makes no sense: it's not a fresh address, it's a list of addresses
      // - name of the query makes no sense in a singular form
      freshAddress: AddressFromDerivationPathQuery,
      accountUTXOs: AccountUnspentOutputsQuery,
    },
    RenderLoading: GrowingSpinner,
    RenderError: CardError,
    propsToQueryParams: (props) => ({
      pageSize: -1,
      accountId: props.match.params.accountId,
      from: 0,
      to: 0,
    }),
  },
);
