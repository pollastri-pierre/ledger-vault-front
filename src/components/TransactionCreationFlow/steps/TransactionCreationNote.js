// @flow

import React from "react";
import invariant from "invariant";
import { useTranslation } from "react-i18next";

import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import { Label, InputText, Form, TextArea } from "components/base/form";

import type { TransactionCreationStepProps } from "../types";

export default (props: TransactionCreationStepProps<any>) => {
  const { payload, updatePayload, onEnter } = props;
  const { bridge, transaction } = payload;
  const { t } = useTranslation();

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
  const inner = (
    <Box flow={20}>
      <Box>
        <Label>{t("transactionCreation:steps.note.noteTitle")}</Label>
        <InputText
          autoFocus
          placeholder={t("transactionCreation:steps.note.noteTitle")}
          data-test="title_tx"
          value={transaction.note.title}
          onChange={handleChangeTitle}
        />
      </Box>
      <Box>
        <Label>{t("transactionCreation:steps.note.noteContent")}</Label>
        <TextArea
          placeholder={t("transactionCreation:steps.note.noteContent")}
          data-test="description_tx"
          value={transaction.note.content}
          onChange={handleChangeContent}
        />
      </Box>
      <Box alignSelf="flex-start">
        <InfoBox type="info">
          {t("transactionCreation:steps.note.noteDesc")}
        </InfoBox>
      </Box>
    </Box>
  );
  return <Form onSubmit={onEnter}>{inner}</Form>;
};
