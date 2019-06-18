// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import LineRow from "components/LineRow";
import ListGroupMembers from "components/ListGroupMembers";
import { hasEditOccured, onlyDescriptionChanged } from "./utils";

import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {};

class GroupCreationConfirmation extends PureComponent<Props> {
  render() {
    const { payload, initialPayload } = this.props;
    return (
      <Box grow flow={20}>
        <Box grow>
          <LineRow
            data-test="group_name"
            label={<Trans i18nKey="group:create.name" />}
          >
            {payload.name}
          </LineRow>
          <LineRow
            data-test="group_desc"
            label={<Trans i18nKey="group:create.description" />}
          >
            {payload.description}
          </LineRow>
          <LineRow
            data-test="group_member"
            label={<Trans i18nKey="group:create.nb_members" />}
          >
            <div style={{ width: 400 }}>
              <ListGroupMembers users={payload.members} allUsers={[]} />
            </div>
          </LineRow>
        </Box>
        {!hasEditOccured(payload, initialPayload) ? (
          <InfoBox type="info" withIcon>
            <Trans i18nKey="group:create.no_edit" />
          </InfoBox>
        ) : (
          onlyDescriptionChanged(payload, initialPayload) && (
            <InfoBox type="info" withIcon>
              <Trans i18nKey="group:create.no_hsm_validation" />
            </InfoBox>
          )
        )}
      </Box>
    );
  }
}

export default GroupCreationConfirmation;
