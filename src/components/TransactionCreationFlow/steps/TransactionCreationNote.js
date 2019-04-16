// @flow

import React from "react";
import invariant from "invariant";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import { Label, InputText } from "components/base/form";

import type { TransactionCreationStepProps } from "../types";

export default (props: TransactionCreationStepProps<any>) => {
  const { payload, updatePayload } = props;
  const { bridge, transaction } = payload;

  invariant(bridge, "No bridge");
  invariant(transaction, "No transaction");

  const editNote = notePatch => {
    const prevNote = bridge.getTransactionNote(transaction);
    const note = { ...prevNote, ...notePatch };
    updatePayload({
      transaction: bridge.editTransactionNote(transaction, note),
    });
  };

  const handleChangeTitle = title => editNote({ title });
  const handleChangeContent = content => editNote({ content });

  return (
    <Box flow={20}>
      <Box>
        <Label>
          <Trans i18nKey="transactionCreation:steps.note.noteTitle" />
        </Label>
        <InputText
          autoFocus
          placeholder="Title"
          value={transaction.note.title}
          onChange={handleChangeTitle}
        />
      </Box>
      <Box>
        <Label>
          <Trans i18nKey="transactionCreation:steps.note.noteContent" />
        </Label>
        <InputText
          placeholder="Content"
          value={transaction.note.content}
          onChange={handleChangeContent}
        />
      </Box>
      <Box alignSelf="flex-start">
        <InfoBox type="info">
          <Trans i18nKey="transactionCreation:steps.note.noteDesc" />
        </InfoBox>
      </Box>
    </Box>
  );
};
