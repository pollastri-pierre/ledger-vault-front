// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import { Trans } from "react-i18next";
import colors from "shared/colors";
import { createAndApprove } from "device/interactions/approveFlow";

import RequestActionButtons from "components/RequestActionButtons";
import ApproveRequestButton from "components/ApproveRequestButton";

import type { Group } from "data/types";
import { hasPendingRequest } from "utils/entities";

type Props = {
  group: Group,
  tabsIndex: number,
  close: void => void,
};

class GroupDetailsFooter extends PureComponent<Props> {
  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { group, tabsIndex } = this.props;
    const { status } = group;

    return (
      <>
        {hasPendingRequest(group) && (
          <RequestActionButtons
            onSuccess={this.onSuccess}
            onError={null}
            entity={group}
          />
        )}
        {status === "ACTIVE" && tabsIndex < 2 && !hasPendingRequest(group) && (
          <Box style={{ width: 200 }}>
            <ApproveRequestButton
              interactions={createAndApprove}
              onSuccess={this.onSuccess}
              color={colors.grenade}
              onError={null}
              isRevoke
              disabled={false}
              additionalFields={{
                data: { group_id: group.id },
                type: "REVOKE_GROUP",
              }}
              buttonLabel={<Trans i18nKey="group:delete" />}
            />
          </Box>
        )}
      </>
    );
  }
}

export default GroupDetailsFooter;
