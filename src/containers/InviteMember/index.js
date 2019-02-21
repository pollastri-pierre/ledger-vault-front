// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { FaUserEdit, FaLink } from "react-icons/fa";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import InputField from "components/InputField";
import { ModalHeader, ModalTitle, ModalBody } from "components/base/Modal";
import CopyToClipboardButton from "components/CopyToClipboardButton";

import colors from "shared/colors";

type Props = {
  close: () => void,
  memberRole: string
};
type State = {
  username: string,
  userID: string,
  loading: boolean,
  url: string
};

const styles = {
  icon: {
    marginRight: 10
  },
  copyText: {
    color: colors.steel,
    fontWeight: "bold"
  }
};

class MemberDetails extends PureComponent<Props, State> {
  state = {
    username: "",
    userID: "",
    loading: false,
    url: ""
  };

  updateUsername = (username: string) => {
    this.setState({ username });
  };

  updateUserID = (userID: string) => {
    this.setState({ userID });
  };

  processUserInfo = async () => {
    const { url } = this.state;
    if (url !== "") {
      // TODO: placeholder for PUT request just to update the userinfo
      await new Promise(r => setTimeout(r, 1e3));
    } else {
      this.setState({ loading: true });
      // TODO placeholder for POST request to generate url
      await new Promise(r => setTimeout(r, 1e3));
      this.setState({
        loading: false,
        // NOTE: url will be in the response from the gate
        url: "www.vault.ledger/AdministratorRegistration"
      });
    }
  };

  render() {
    const { close, memberRole } = this.props;
    const { username, userID, loading, url } = this.state;
    return (
      <ModalBody onClose={close}>
        <ModalHeader>
          <ModalTitle mb={0}>
            <Trans
              i18nKey="inviteMember:inviteLink"
              values={{
                memberRole
              }}
            />
          </ModalTitle>
        </ModalHeader>
        <Box flow={20}>
          <InputField
            value={username}
            label="Username"
            onChange={this.updateUsername}
            placeholder="Please type in your username"
            fullWidth
            maxLength={19}
            error={null}
          />
          <InputField
            value={userID}
            label="User ID"
            onChange={this.updateUserID}
            placeholder="Please type in your user ID"
            fullWidth
            maxLength={20}
            error={null}
          />
          <Box pt={10}>
            <Button
              onClick={this.processUserInfo}
              color="primary"
              variant="outlined"
              disabled={username === "" || userID === ""}
            >
              {url === "" ? (
                <Fragment>
                  <FaLink style={styles.icon} />
                  <Trans i18nKey="inviteMember:generateLink" />
                </Fragment>
              ) : (
                <Fragment>
                  <FaUserEdit style={styles.icon} />
                  <Trans i18nKey="inviteMember:updateMember" />
                </Fragment>
              )}
            </Button>
          </Box>
          {url !== "" ? (
            <Box flow={20}>
              <InfoBox type="info">
                <Trans
                  i18nKey="inviteMember:description"
                  values={{
                    memberRole
                  }}
                />
              </InfoBox>
              <Box p={5} bg={colors.cream} borderRadius={5}>
                <CopyToClipboardButton
                  visible
                  style={styles.copyText}
                  textToCopy={url}
                />
              </Box>
            </Box>
          ) : loading ? (
            <Box align="center">
              <CircularProgress />
            </Box>
          ) : null}
        </Box>
      </ModalBody>
    );
  }
}

export default MemberDetails;
