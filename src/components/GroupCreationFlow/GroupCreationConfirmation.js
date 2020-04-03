// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import LineRow from "components/LineRow";
import CollapsibleText from "components/CollapsibleText";

import ListGroupMembers from "components/ListGroupMembers";
import {
  hasEditOccuredGeneric,
  onlyDescriptionChangedGeneric,
} from "utils/creationFlows";

import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {};

class GroupCreationConfirmation extends PureComponent<Props> {
  render() {
    const { payload, payloadToCompareTo } = this.props;
    return (
      <Box grow flow={20}>
        <Box grow>
          <LineRow
            data-test="group_name"
            label={<Trans i18nKey="group:create.name" />}
          >
            {payload.name}
          </LineRow>
          <CollapsibleText
            label={<Trans i18nKey="group:create.description" />}
            content={payload.description || ""}
          />
          <LineRow
            data-test="group_member"
            label={<Trans i18nKey="group:create.nb_members" />}
          >
            <div style={{ width: 400 }}>
              <ListGroupMembers users={payload.members} allUsers={[]} />
            </div>
          </LineRow>
        </Box>
        {!hasEditOccuredGeneric(payload, payloadToCompareTo, "members") ? (
          <InfoBox type="info" withIcon>
            <Trans i18nKey="group:create.no_edit" />
          </InfoBox>
        ) : (
          onlyDescriptionChangedGeneric(
            payload,
            payloadToCompareTo,
            "members",
          ) && (
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
