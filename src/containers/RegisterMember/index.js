// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import network from "network";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";

import OrganizationQuery from "api/queries/OrganizationQuery";

import Text from "components/base/Text";
import Box from "components/base/Box";
import { ModalHeader, ModalBody, ModalFooter } from "components/base/Modal";
import Card from "components/base/Card";
import LineSeparator from "components/LineSeparator";
import DialogButton from "components/buttons/DialogButton";

import colors from "shared/colors";
import { FaUser } from "react-icons/fa";

import type { GateError, MemberInvite } from "data/types";

import { getAuthentication } from "./helpers";

type Props = {
  match: Match,
  organization: *
};
type State = {
  member: ?MemberInvite,
  loading: boolean,
  error: ?$Shape<GateError>,
  success: boolean
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
    success: false
  };

  async componentDidMount() {
    const { match } = this.props;
    const urlID = match.params.urlID;
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

  registerMember = async () => {
    const { match, organization } = this.props;
    const { member } = this.state;
    const urlID = match.params.urlID;
    const url = `/requests/registration/${urlID}/challenge`;

    try {
      const { challenge } = await network(url, "POST");
      // NOTE: call abstracted out. it will be refactored and generalized soon
      await getAuthentication(challenge, organization, member);
      this.setState({ success: true });
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const { member, loading, error, success } = this.state;

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
                {error && (
                  <Text style={styles.error}>{error.json.message}</Text>
                )}
                <ModalFooter>
                  <DialogButton highlight onTouchTap={this.registerMember}>
                    <Trans i18nKey="inviteMember:registration.button" />
                  </DialogButton>
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
