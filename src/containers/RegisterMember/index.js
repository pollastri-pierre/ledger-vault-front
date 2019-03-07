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

import type { GateError, MemberInvite, Organization } from "data/types";

type Props = {
  match: Match,
  organization: Organization
};
type State = {
  member: ?MemberInvite,
  loading: boolean,
  error: ?GateError | ?Error,
  success: boolean,
  isRegistering: boolean
};

const styles = {
  container: {
    minHeight: "100vh"
  },
  error: {
    color: colors.grenade,
    marginTop: 10
  }
};

class RegisterMember extends PureComponent<Props, State> {
  state = {
    member: null,
    loading: true,
    error: null,
    success: false,
    isRegistering: false
  };

  async componentDidMount() {
    const { match } = this.props;
    const urlID = match.params.urlID || "";
    const url = `/requests/${urlID}`;
    try {
      const member = await network(url, "GET");
      this.setState({
        member,
        loading: false
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  registerMember = () => {
    this.setState({ isRegistering: true });
  };

  onSuccess = () => {
    this.setState({ isRegistering: false, success: true });
  };

  onError = error => {
    this.setState({ error, isRegistering: false });
  };

  render() {
    const { member, loading, error, success } = this.state;

    const stringError = getStringError(error);

    return (
      <Box justify="center" align="center" style={styles.container}>
        <Card>
          {!loading &&
            !success && (
              <ModalBody>
                <ModalHeader>
                  <Box horizontal align="center" flow={10}>
                    <Text
                      header
                      bold
                      i18nKey="inviteMember:registration.title"
                      values={{
                        memberRole: "Administrator"
                      }}
                    />
                    <FaUser />
                  </Box>
                </ModalHeader>
                <LineSeparator />
                <Box flow={15} mt={15}>
                  <Row
                    label="inviteMember:registration.username"
                    text={member && member.user ? member.user.username : ""}
                  />
                  <Row
                    label="inviteMember:registration.workspace"
                    text={
                      member && member.user.user_id ? member.user.user_id : ""
                    }
                  />
                  <Row
                    label="inviteMember:registration.role"
                    text={member ? member.type : ""}
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
                          member,
                          urlID: this.props.match.params.urlID
                        }}
                      />
                    </Box>
                  ) : (
                    <DialogButton highlight onTouchTap={this.registerMember}>
                      <Trans i18nKey="inviteMember:registration.button" />
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
                    i18nKey="inviteMember:registration.success.title"
                  />
                  <span role="img" aria-label="tada" aria-hidden="true">
                    🎉
                  </span>
                </Box>
                <Text
                  bold
                  i18nKey="inviteMember:registration.success.subtitle"
                />
              </ModalHeader>
              <LineSeparator />
              <Box flow={15} mt={15}>
                <Text i18nKey="inviteMember:registration.success.description" />
              </Box>
            </ModalBody>
          )}
        </Card>
      </Box>
    );
  }
}
export default connectData(RegisterMember, {
  queries: {
    organization: OrganizationQuery
  },
  propsToQueryParams: ({ match }: { match: Match }) => ({
    urlID: match.params.urlID
  })
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
