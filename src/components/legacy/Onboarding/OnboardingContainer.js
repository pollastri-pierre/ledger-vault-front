// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import io from "socket.io-client";

import connectData from "restlay/connectData";
import OrganizationQuery from "api/queries/OrganizationQuery";
import { SpinnerCentered } from "components/base/Spinner";
import HelpLink from "components/HelpLink";
import Logo from "components/icons/Logo";
import CenteredLayout from "components/base/CenteredLayout";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Absolute from "components/base/Absolute";
import { getState, changeQuorum } from "redux/modules/onboarding";
import type { Organization } from "data/types";
import Welcome from "./Welcome";
import WrappingKeys from "./WrappingKeys";
import Prerequisite from "./Prerequisite";
import PrerequisiteSeed from "./PrerequisiteSeed";
import WrappingKeyPrerequisite from "./WrappingKeyPrerequisite";
import SharedOwnerRegistration from "./SharedOwnerRegistration";
import ConfigurationAdministrators from "./ConfigurationAdministrators";
import ConfigurationWrapping from "./ConfigurationWrapping";
import ConfigurationSeed from "./ConfigurationSeed";
import Registration from "./Registration";
import SharedOwnerValidation from "./SharedOwnerValidation";
import Backup from "./Backup";
import Provisionning from "./Provisioning";
import ConfirmationGlobal from "./ConfirmationGlobal";
import AdministrationScheme from "./AdministrationScheme";
import Menu from "./Menu";

const mapStateToProps = state => ({
  onboarding: state.onboarding,
});

const mapDispatchToProps = (dispatch: *) => ({
  onGetState: () => dispatch(getState()),
  changeNbRequired: nb => dispatch(changeQuorum(nb)),
});

type Props = {
  match: *,
  history: *,
  onboarding: *,
  changeNbRequired: Function,
  organization: Organization,
  onGetState: Function,
};

type State = {
  nbAdministrator: number,
  nbRequired: number,
};

const WIDTH = 750;

const Container = styled(Box).attrs({
  position: "relative",
  horizontal: true,
  p: 40,
  pl: 0,
  width: WIDTH,
})`
  background: white;
  box-shadow: 0 2.5px 2.5px 0 rgba(0, 0, 0, 0.04);
  opacity: ${p => (p.fatalError ? "0.3" : "1")};
  pointerevents: ${p => (p.fatalError ? "none" : "auto")};
`;

class OnboardingContainer extends Component<Props, State> {
  componentDidMount() {
    this.props.onGetState();

    const url = process.env.NOTIFICATION_URL || "/";
    const path = process.env.NOTIFICATION_PATH || "/notification/socket.io";
    // $FlowFixMe
    const socket = io.connect(url, { onboarding: true, path });
    socket.on("connect", () => {
      socket.emit("authenticate", {
        token: "onboarding",
        orga: this.props.match.params.workspace,
      });
    });
    socket.on(`${this.props.match.params.workspace}/onboarding`, () => {
      this.onNewOnboardingState();
    });
  }

  onNewOnboardingState = () => {
    setTimeout(() => {
      this.props.onGetState();
    }, Math.floor(Math.random() * 1000));
  };

  render() {
    const {
      onboarding,
      organization,
      changeNbRequired,
      match,
      history,
    } = this.props;
    if (!onboarding.state) {
      return <SpinnerCentered />;
    }
    const nbMember =
      onboarding.state === "COMPLETE"
        ? "OK"
        : onboarding.registering.admins.length;
    const nbSharedOwner =
      onboarding.state === "COMPLETE"
        ? "OK"
        : onboarding.registering_shared_owner.sharedOwners.length;
    return (
      <CenteredLayout>
        <Container fatalError={onboarding.fatal_error}>
          <Absolute top={-52} width={WIDTH}>
            <Box horizontal justify="space-between">
              <Logo width={120} />
              <HelpLink>
                <Text size="small" fontWeight="bold" uppercase>
                  HELP
                </Text>
              </HelpLink>
            </Box>
          </Absolute>
          <Menu
            nbMember={nbMember}
            nbSharedOwner={nbSharedOwner}
            onboarding={onboarding}
          />
          <Box position="relative" flex={1}>
            {onboarding.state === "LOADING" && <SpinnerCentered />}
            {onboarding.state === "EMPTY_PARTITION" && <Welcome />}
            {onboarding.state === "WRAPPING_KEY_PREREQUISITES" && (
              <WrappingKeyPrerequisite />
            )}
            {onboarding.state === "WRAPPING_KEY_CONFIGURATION" && (
              <ConfigurationWrapping />
            )}
            {onboarding.state === "WRAPPING_KEY_BACKUP" && <Backup />}
            {onboarding.state === "WRAPPING_KEY_SIGN_IN" && <WrappingKeys />}
            {onboarding.state === "ADMINISTRATORS_PREREQUISITE" && (
              <Prerequisite />
            )}
            {onboarding.state === "ADMINISTRATORS_CONFIGURATION" && (
              <ConfigurationAdministrators />
            )}
            {onboarding.state === "ADMINISTRATORS_REGISTRATION" && (
              <Registration history={history} organization={organization} />
            )}
            {onboarding.state === "ADMINISTRATORS_SCHEME_CONFIGURATION" && (
              <AdministrationScheme
                onChange={changeNbRequired}
                total={onboarding.registering.admins.length}
                number={onboarding.quorum}
                is_editable={onboarding.is_editable}
              />
            )}
            {onboarding.state === "MASTER_SEED_PREREQUISITE" && (
              <PrerequisiteSeed />
            )}
            {onboarding.state === "MASTER_SEED_CONFIGURATION" && (
              <ConfigurationSeed />
            )}
            {onboarding.state === "MASTER_SEED_BACKUP" && <Backup />}
            {onboarding.state === "SHARED_OWNER_REGISTRATION" && (
              <SharedOwnerRegistration organization={organization} />
            )}
            {onboarding.state === "SHARED_OWNER_VALIDATION" && (
              <SharedOwnerValidation />
            )}
            {onboarding.state === "MASTER_SEED_GENERATION" && <Provisionning />}
            {onboarding.state === "COMPLETE" && (
              <ConfirmationGlobal match={match} history={history} />
            )}
          </Box>
        </Container>
      </CenteredLayout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connectData(OnboardingContainer, {
    queries: {
      organization: OrganizationQuery,
    },
    RenderError: ({ error }) => `error ${error.toString()}`,
  }),
);
