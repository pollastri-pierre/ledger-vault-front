// @flow

import React, { useState } from "react";
import { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";
import { getBridgeForCurrency } from "bridge";
import { FaRegCommentAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import Box from "components/base/Box";

import Text from "components/base/Text";
import AccountName from "components/AccountName";
import FakeInputContainer from "components/base/FakeInputContainer";
import CounterValue from "components/CounterValue";
import { AmountTooHigh, TooManyUTXOs } from "utils/errors";
import { InputNumber, InputText, Label, TextArea } from "components/base/form";
import type { Connection } from "restlay/ConnectionQuery";
import type { UTXO } from "data/types";
import type { ConsolidateUTXOStepProps } from "./types";

const bitcoinBridge = getBridgeForCurrency(getCryptoCurrencyById("bitcoin"));
const { EditFees } = bitcoinBridge;

// FIXME we probably want to fetch this info
const MAX_UTXOS_TO_CONSOLIDATE = 100;

export const calculateTotalAmount = (
  utxoList: Connection<UTXO>,
  numberOfUxto: number,
) => {
  return utxoList.edges.slice(0, numberOfUxto).reduce((total, uxto) => {
    return total.plus(uxto.node.amount);
  }, BigNumber(0));
};

const Consolidate = (props: ConsolidateUTXOStepProps) => {
  const { account, bridge, payload, accountUTXOs } = props;
  const { transaction } = payload;
  const { t } = useTranslation();
  const [displayNote, setDisplayNote] = useState(false);
  const onUTXOChange = val => {
    const totalAmount = calculateTotalAmount(accountUTXOs, val);

    const patch = {
      transaction: {
        ...bridge.editTransactionAmount(account, transaction, totalAmount),
        expectedNbUTXOs: val,
      },
    };
    props.updatePayload(patch);
  };

  const onFeeChange = transaction => {
    props.updatePayload({ transaction });
  };

  const onCommentContentChange = content => {
    const note = {
      ...transaction.note,
      content,
    };
    const patch = {
      transaction: { ...bridge.editTransactionNote(transaction, note) },
    };
    props.updatePayload(patch);
  };

  const onCommentTitleChange = title => {
    const note = {
      ...transaction.note,
      title,
    };
    const patch = {
      transaction: { ...bridge.editTransactionNote(transaction, note) },
    };

    props.updatePayload(patch);
  };

  return (
    <Box flow={20}>
      <Box>
        <Label>Account to consolidate</Label>
        <FakeInputContainer leftAlign>
          <AccountName account={account} />
        </FakeInputContainer>
      </Box>
      <Box horizontal align="center" flow={20}>
        <Box flex="1">
          <Label>UTXO</Label>
          <InputNumber
            max={Math.min(accountUTXOs.edges.length, MAX_UTXOS_TO_CONSOLIDATE)}
            onChange={onUTXOChange}
            value={transaction.expectedNbUTXOs}
            errors={collectAmountError(transaction)}
          />
        </Box>
        <Box flex="1">
          <Label>Amount</Label>
          <FakeInputContainer>
            <CounterValue
              smallerInnerMargin
              value={payload.transaction.amount}
              from={account.currency}
            />
          </FakeInputContainer>
        </Box>
      </Box>
      {EditFees && (
        <EditFees
          account={account}
          bridge={bridge}
          transaction={payload.transaction}
          onChangeTransaction={onFeeChange}
        />
      )}
      {displayNote ? (
        <Box flow={20}>
          <Box>
            <Box horizontal align="center" justify="space-between">
              <Label>{t("transactionCreation:steps.note.noteTitle")}</Label>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setDisplayNote(false)}
              >
                <MdClose />
              </div>
            </Box>
            <InputText
              autoFocus
              placeholder={t("transactionCreation:steps.note.noteTitle")}
              data-test="title_tx"
              value={transaction.note.title}
              onChange={onCommentTitleChange}
            />
          </Box>
          <Box>
            <Label>{t("transactionCreation:steps.note.noteContent")}</Label>
            <TextArea
              placeholder={t("transactionCreation:steps.note.noteContent")}
              data-test="description_tx"
              value={transaction.note.content}
              onChange={onCommentContentChange}
            />
          </Box>
        </Box>
      ) : (
        <Box
          style={{ cursor: "pointer" }}
          onClick={() => setDisplayNote(true)}
          horizontal
          align="center"
          flow={10}
        >
          <FaRegCommentAlt />
          <Text fontWeight="bold">Add comments to transaction</Text>
        </Box>
      )}
    </Box>
  );
};

const collectAmountError = transaction => {
  if (!transaction.error) return undefined;
  if (transaction.error instanceof AmountTooHigh) {
    return [new TooManyUTXOs()];
  }
  return [transaction.error];
};

export default Consolidate;
