// @flow
import React from "react";
import Status from "components/Status";
import Text from "components/base/Text";

type ConfirmationStatusProps = {
  nbConfirmations: number,
  threshold: number,
};
export default function ConfirmationStatus(props: ConfirmationStatusProps) {
  const { nbConfirmations, threshold } = props;

  if (nbConfirmations > 0) {
    return (
      <Status derivedStatus="DERIVED_TX_CONFIRMED">
        <Text
          i18nKey="status:confirmed"
          values={{
            nbConfirmations:
              nbConfirmations >= threshold ? `${threshold}+` : nbConfirmations,
          }}
        />
      </Status>
    );
  }

  return (
    <Status derivedStatus="DERIVED_TX_UNCONFIRMED">
      <Text i18nKey="status:unconfirmed" />
    </Status>
  );
}
