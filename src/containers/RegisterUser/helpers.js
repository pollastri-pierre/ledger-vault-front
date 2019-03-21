// @flow
import React from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";

export function Row(props: { label: string, text: string }) {
  const { label, text } = props;
  return (
    <Box horizontal flow={5}>
      <Text uppercase bold i18nKey={label} />
      <Text>{text}</Text>
    </Box>
  );
}
export function getStringError(error: Object) {
  if (!error || !error.json || !error.json.message) return null;
  return error.json.message;
}
