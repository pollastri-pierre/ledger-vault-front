// @flow
import React from "react";
import type { Whitelist } from "data/types";
import { FaAddressBook } from "react-icons/fa";
import { CardError } from "components/base/Card";
import { GrowingSpinner } from "components/base/GrowingCard";
import EntityModal from "components/EntityModal";
import { WhitelistDetails as WhitelistComponent } from "components/WhitelistCreationFlow/WhitelistCreationConfirmation";

import WhitelistQuery from "api/queries/WhitelistQuery";
import connectData from "restlay/connectData";

type Props = {
  whitelist: Whitelist,
  close: Function,
};
const WhitelistDetails = (props: Props) => {
  const { close, whitelist } = props;
  return (
    <EntityModal
      growing
      entity={whitelist}
      Icon={FaAddressBook}
      title={whitelist.name}
      onClose={close}
      revokeButton={() => <div>revoke button</div>}
      editURL={`/whitelists/edit/${whitelist.id}`}
    >
      <WhitelistComponent key="overview" whitelist={whitelist} />
    </EntityModal>
  );
};

export default connectData(WhitelistDetails, {
  RenderError: CardError,
  RenderLoading: GrowingSpinner,
  queries: {
    whitelist: WhitelistQuery,
  },
  propsToQueryParams: props => ({
    whitelistId: props.match.params.whitelistId,
  }),
});
