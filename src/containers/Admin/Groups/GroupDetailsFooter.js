// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";

import colors from "shared/colors";
import { createAndApprove } from "device/interactions/approveFlow";
import Box from "components/base/Box";
import Text from "components/base/Text";
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
          <Box px={15} align="flex-start">
            <ApproveRequestButton
              interactions={createAndApprove}
              onSuccess={this.onSuccess}
              color={colors.grenade}
              isRevoke
              disabled={false}
              additionalFields={{
                data: { group_id: group.id },
                type: "REVOKE_GROUP",
              }}
              buttonLabel={<Trans i18nKey="group:delete" />}
              withConfirm
              confirmLabel={<Trans i18nKey="group:delete" />}
              confirmContent={
                <Box flow={15} align="flex-start">
                  <Text i18nKey="group:revokeWarning.content" />
                </Box>
              }
            />
          </Box>
        )}
      </>
    );
  }
}

export default GroupDetailsFooter;
