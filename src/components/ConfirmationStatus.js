// @flow
import React from "react";
import Status from "components/Status";
import Text from "components/base/Text";

type ConfirmationStatusProps = {
  nbConfirmations: number,
  threshold: number,
  hideConfirmationNumber?: boolean,
};
export default function ConfirmationStatus(props: ConfirmationStatusProps) {
  const { nbConfirmations, threshold, hideConfirmationNumber } = props;

  if (nbConfirmations > 0) {
    if (hideConfirmationNumber) {
      return (
        <Status derivedStatus="DERIVED_TX_CONFIRMED">
          <Text>Confirmed</Text>
        </Status>
      );
    }
    return (
      <Status derivedStatus="DERIVED_TX_CONFIRMED">
        <Text
          i18nKey="status:confirmed"
          noWrap
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
      <Text noWrap i18nKey="status:unconfirmed" />
    </Status>
  );
}
