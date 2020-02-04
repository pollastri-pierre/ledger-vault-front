// @flow

import React, { useState } from "react";
import invariant from "invariant";

import connectData from "restlay/connectData";
import { Trans } from "react-i18next";
import { Redirect } from "react-router";
import type { Match } from "react-router-dom";

import OrganizationQuery from "api/queries/OrganizationQuery";
import InviteUserQuery from "api/queries/InviteUserQuery";
import DeviceInteraction from "components/DeviceInteraction";
import { registerUserFlow } from "device/interactions/hsmFlows";
import type { RestlayEnvironment } from "restlay/connectData";
import { UserInvitationAlreadyUsed } from "utils/errors";

import CenteredLayout from "components/base/CenteredLayout";
import TryAgain from "components/TryAgain";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import LineRow from "components/LineRow";
import TransportChooser from "components/TransportChooser";
import Absolute from "components/base/Absolute";

import Text from "components/base/Text";
import Box from "components/base/Box";
import { SpinnerCentered } from "components/base/Spinner";
import Button from "components/base/Button";
import { ModalHeader, ModalBody, ModalFooter } from "components/base/Modal";
import Card from "components/base/Card";

import type { UserInvite, Organization } from "data/types";

import RegisterUserSuccess from "./RegisterUserSuccess";
import { userRoleIcon } from "./helpers";

type Props = {
  match: Match,
  organization: Organization,
  userInvite: ?UserInvite,
  restlay: RestlayEnvironment,
};

function RegisterUser(props: Props) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isRegistering, setRegistering] = useState(false);

  const { userInvite, organization, restlay, match } = props;

  invariant(userInvite, "No user invitation found.");

  function renderUserIcon() {
    return userRoleIcon(userInvite);
  }
  function onSuccess() {
    setRegistering(false);
    setSuccess(true);
    setError(null);
  }

  function onError(err) {
    setRegistering(false);
    setError(err);
  }

  if (userInvite.status !== "PENDING_REGISTRATION") {
    const error = new UserInvitationAlreadyUsed();
    return (
      <>
        <TriggerErrorNotification error={error} />
        <Redirect to="/" />
      </>
    );
  }

  const userRoleLabel =
    userInvite.user.role === "OPERATOR" ? "Operator" : "Administrator";

  const workspace = window.location.pathname.split("/")[1];

  return (
    <CenteredLayout>
      {error && <TriggerErrorNotification error={error} />}
      <Card overflow="visible">
        {success ? (
          <RegisterUserSuccess />
        ) : (
          <ModalBody width={550}>
            <ModalHeader>
              <Box horizontal align="center" flow={10}>
                <Text
                  size="header"
                  fontWeight="bold"
                  i18nKey="inviteUser:registration.title"
                  values={{ userRole: userRoleLabel }}
                />
                {renderUserIcon()}
              </Box>
            </ModalHeader>

            <Absolute top={10} right={10}>
              <TransportChooser />
            </Absolute>

            <Box mt={15}>
              <LineRow
                label={<Trans i18nKey="inviteUser:registration.username" />}
              >
                {userInvite.user.username}
              </LineRow>
              <LineRow
                label={<Trans i18nKey="inviteUser:registration.userID" />}
              >
                {userInvite.user.user_id.toUpperCase()}
              </LineRow>
              <LineRow
                label={<Trans i18nKey="inviteUser:registration.workspace" />}
              >
                {workspace}
              </LineRow>
            </Box>
            <ModalFooter>
              {isRegistering ? (
                <Box mb={15}>
                  <DeviceInteraction
                    onSuccess={onSuccess}
                    interactions={registerUserFlow}
                    onError={onError}
                    additionalFields={{
                      organization,
                      username: userInvite.user.username,
                      role: userInvite
                        ? userInvite.user.role.toLowerCase()
                        : "admin",
                      member: userInvite,
                      urlID: match.params.urlID,
                      restlay,
                    }}
                  />
                </Box>
              ) : (
                <Box my={10}>
                  <Button
                    type="filled"
                    onClick={() => setRegistering(true)}
                    data-test="button_registration"
                  >
                    <Trans i18nKey="inviteUser:registration.button" />
                  </Button>
                </Box>
              )}
            </ModalFooter>
          </ModalBody>
        )}
      </Card>
    </CenteredLayout>
  );
}

export default connectData(RegisterUser, {
  queries: {
    organization: OrganizationQuery,
    userInvite: InviteUserQuery,
  },
  propsToQueryParams: ({ match }: { match: Match }) => ({
    urlID: match.params.urlID,
  }),
  RenderError: TryAgain,
  RenderLoading: SpinnerCentered,
});
