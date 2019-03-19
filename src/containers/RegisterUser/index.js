// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import network from "network";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";

import OrganizationQuery from "api/queries/OrganizationQuery";
import DeviceInteraction from "components/DeviceInteraction";
import { registerFlow } from "device/interactions/registerFlow";

import Text from "components/base/Text";
import Box from "components/base/Box";
import { ModalHeader, ModalBody, ModalFooter } from "components/base/Modal";
import Card from "components/base/Card";
import LineSeparator from "components/LineSeparator";
import DialogButton from "components/buttons/DialogButton";

import colors from "shared/colors";
import { FaUser } from "react-icons/fa";

import type { GateError, UserInvite, Organization } from "data/types";

type Props = {
  match: Match,
  organization: Organization,
};
type State = {
  userInvite: ?UserInvite,
  loading: boolean,
  error: ?GateError | ?Error,
  success: boolean,
  isRegistering: boolean,
};

const styles = {
  container: {
    minHeight: "100vh",
  },
  error: {
    color: colors.grenade,
    marginTop: 10,
  },
};

class RegisterUser extends PureComponent<Props, State> {
  state = {
    userInvite: null,
    loading: true,
    error: null,
    success: false,
    isRegistering: false,
  };

  async componentDidMount() {
    const { match } = this.props;
    const urlID = match.params.urlID || "";
    const url = `/requests/${urlID}`;
    try {
      const userInvite = await network(url, "GET");
      this.setState({
        userInvite,
        loading: false,
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  registerUser = () => {
    this.setState({ isRegistering: true });
  };

  onSuccess = () => {
    this.setState({ isRegistering: false, success: true });
  };

  onError = error => {
    this.setState({ error, isRegistering: false });
  };

  render() {
    const { userInvite, loading, error, success } = this.state;

    const stringError = getStringError(error);

    return (
      <Box justify="center" align="center" style={styles.container}>
        <Card>
          {!loading && !success && (
            <ModalBody>
              <ModalHeader>
                <Box horizontal align="center" flow={10}>
                  <Text
                    header
                    bold
                    i18nKey="inviteUser:registration.title"
                    values={{
                      userRole: "Administrator",
                    }}
                  />
                  <FaUser />
                </Box>
              </ModalHeader>
              <LineSeparator />
              <Box flow={15} mt={15}>
                <Row
                  label="inviteUser:registration.username"
                  text={
                    userInvite && userInvite.user
                      ? userInvite.user.username
                      : ""
                  }
                />
                <Row
                  label="inviteUser:registration.workspace"
                  text={
                    userInvite && userInvite.user.user_id
                      ? userInvite.user.user_id
                      : ""
                  }
                />
                <Row
                  label="inviteUser:registration.role"
                  text={userInvite ? userInvite.type : ""}
                />
              </Box>
              {stringError && <Text style={styles.error}>{stringError}</Text>}
              <ModalFooter>
                {this.state.isRegistering ? (
                  <Box mb={20}>
                    <DeviceInteraction
                      onSuccess={this.onSuccess}
                      interactions={registerFlow}
                      onError={this.onError}
                      additionalFields={{
                        organization: this.props.organization,
                        member: userInvite,
                        urlID: this.props.match.params.urlID,
                      }}
                    />
                  </Box>
                ) : (
                  <DialogButton highlight onTouchTap={this.registerUser}>
                    <Trans i18nKey="inviteUser:registration.button" />
                  </DialogButton>
                )}
              </ModalFooter>
            </ModalBody>
          )}
          {success && (
            <ModalBody>
              <ModalHeader>
                <Box horizontal align="center" flow={10}>
                  <Text
                    header
                    bold
                    i18nKey="inviteUser:registration.success.title"
                  />
                  <span role="img" aria-label="tada" aria-hidden="true">
                    🎉
                  </span>
                </Box>
                <Text bold i18nKey="inviteUser:registration.success.subtitle" />
              </ModalHeader>
              <LineSeparator />
              <Box flow={15} mt={15}>
                <Text i18nKey="inviteUser:registration.success.description" />
              </Box>
            </ModalBody>
          )}
        </Card>
      </Box>
    );
  }
}
export default connectData(RegisterUser, {
  queries: {
    organization: OrganizationQuery,
  },
  propsToQueryParams: ({ match }: { match: Match }) => ({
    urlID: match.params.urlID,
  }),
});

function Row(props: { label: string, text: string }) {
  const { label, text } = props;
  return (
    <Box horizontal flow={5}>
      <Text uppercase bold i18nKey={label} />
      <Text>{text}</Text>
    </Box>
  );
}
function getStringError(error: Object) {
  if (!error || !error.json || !error.json.message) return null;
  return error.json.message;
}
