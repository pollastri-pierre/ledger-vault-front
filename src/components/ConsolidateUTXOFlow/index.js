// @flow

import React from "react";
import { FaMoneyCheck } from "react-icons/fa";
import { Trans } from "react-i18next";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import connectData from "restlay/connectData";
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
    requirements: payload => payload.hasValidatedAddress,
    Cta: ValidateUTXOConsolidation,
  },
  {
    id: "finish",
    name: <Trans i18nKey="transactionCreation:finish" />,
    Step: () => (
      <MultiStepsSuccess title={"Account successfully consolidated"} />
    ),
  },
];

export default connectData(
  ({ close, account, freshAddress, accountUTXOs, restlay }) => {
    const expectedNbUTXOs = Math.min(
      accountUTXOs.edges.length,
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
      amount: totalAmount,
      recipient: freshAddress[0].address,
      note: { title: "", content: "" },
    };
    const payload = {
      transaction,
      hasValidatedAddress: false,
    };
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaMoneyCheck}
          title="UTXO Consolidation"
          payloadToCompareTo={payload}
          initialPayload={payload}
          additionalProps={{
            account,
            bridge: bitcoinBridge,
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
      freshAddress: AddressFromDerivationPathQuery,
      accountUTXOs: AccountUnspentOutputsQuery,
    },
    RenderLoading: GrowingSpinner,
    RenderError: CardError,
    propsToQueryParams: props => ({
      pageSize: -1,
      accountId: props.match.params.accountId,
      from: 0,
      to: 0,
    }),
  },
);
