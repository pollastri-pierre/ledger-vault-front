// @flow
import React from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import LineSeparator from "components/LineSeparator";
import colors from "shared/colors";
import type { Note } from "data/types";

// after a migration, old notes will be created by SYSTEM ADMIN
const SYS_ADMIN_ID = 1;

export default function TabLabel(props: { note: Note }) {
  const { note } = props;
  if (note && note.title !== "" && note.content !== "") {
    return (
      <Box>
        <Text fontWeight="semiBold">{note.title}</Text>
        <LineSeparator />
        <Text overflowWrap="break-word">{note.content}</Text>
        {note.created_by.id !== SYS_ADMIN_ID && (
          <>
            <LineSeparator />
            <Text
              color={colors.lead}
              size="small"
              i18nKey="transactionDetails:note.author"
              values={{ author: note.created_by.username }}
            />
          </>
        )}
      </Box>
    );
  }
  return <Text i18nKey="transactionDetails:note.noData" />;
}
