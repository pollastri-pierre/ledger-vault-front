// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import network from "network";
import { Trans } from "react-i18next";

import Text from "components/base/Text";
import Box from "components/base/Box";
import { ModalHeader, ModalBody, ModalFooter } from "components/base/Modal";
import Card from "components/base/Card";
import LineSeparator from "components/LineSeparator";
import DialogButton from "components/buttons/DialogButton";

type Props = {
  match: *
};
type State = {
  member: *,
  loading: boolean
};

const styles = {
  container: {
    minHeight: "100vh"
  }
};

class RegisterMember extends PureComponent<Props, State> {
  state = {
    member: { user: {}, type: "" },
    loading: true
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
      console.error("what is the error? ", error, url);
    }
  }

  registerMember = async () => {
    const { match } = this.props;
    const urlID = match.params.urlID;
    const url = `/requests/registration/${urlID}/challenge`;
    const challenge = await network(url, "POST"); // eslint-disable-line no-unused-vars
  };

  render() {
    const { member, loading } = this.state;

    return (
      <Box justify="center" align="center" style={styles.container}>
        <Card>
          {!loading && (
            <ModalBody>
              <ModalHeader>
                <Text
                  header
                  bold
                  i18nKey="inviteMember:registration.title"
                  values={{
                    memberRole: "Administrator"
                  }}
                />
              </ModalHeader>
              <LineSeparator />
              <Box flow={15} mt={15}>
                <Row
                  label="inviteMember:registration.username"
                  text={member.user.username}
                />
                <Row
                  label="inviteMember:registration.workspace"
                  text={member.user.user_id}
                />
                <Row
                  label="inviteMember:registration.role"
                  text={member.type}
                />
              </Box>
              <ModalFooter>
                <DialogButton highlight onTouchTap={this.registerMember}>
                  <Trans i18nKey="inviteMember:registration.button" />
                </DialogButton>
              </ModalFooter>
            </ModalBody>
          )}
        </Card>
      </Box>
    );
  }
}

export default connectData(RegisterMember, {
  propsToQueryParams: ({ match }: { match: * }) => ({
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
