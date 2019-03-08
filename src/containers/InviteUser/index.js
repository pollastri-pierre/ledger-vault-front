// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { FaUserEdit, FaLink } from "react-icons/fa";
import type { GateError } from "data/types";
import InviteUserMutation from "api/mutations/InviteUserMutation";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import InputField from "components/InputField";
import { ModalHeader, ModalTitle, ModalBody } from "components/base/Modal";
import CopyToClipboardButton from "components/CopyToClipboardButton";

import colors from "shared/colors";

type Props = {
  close: () => void,
  userRole: string,
  restlay: *
};
type State = {
  username: string,
  userID: string,
  loading: boolean,
  url: string,
  error: ?$Shape<GateError>
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

class InviteUser extends PureComponent<Props, State> {
  state = {
    username: "",
    userID: "",
    loading: false,
    url: "",
    error: null
  };

  updateUsername = (username: string) => {
    this.setState({ username, error: null });
  };

  updateUserID = (userID: string) => {
    this.setState({ userID, error: null });
  };

  processUserInfo = async () => {
    const { restlay, userRole } = this.props;
    const { url, username, userID } = this.state;
    if (url !== "") {
      // TODO: placeholder for PUT request just to update the userinfo
      await new Promise(r => setTimeout(r, 1e3));
    } else {
      this.setState({ loading: true });

      const query = new InviteUserMutation({
        user: {
          type: userRole === "admin" ? "CREATE_ADMIN" : "CREATE_OPERATOR",
          username,
          user_id: userID
        }
      });

      try {
        const data = await restlay.fetchQuery(query);
        const prefix = window.location.pathname.split("/")[1];
        const url = `${window.location.origin}/${prefix}/register/${
          data.url_id
        }`;
        this.setState({
          loading: true,
          url
        });
      } catch (error) {
        this.setState({
          loading: false,
          error
        });
      }
    }
  };

  render() {
    const { close, userRole } = this.props;
    const { username, userID, loading, url, error } = this.state;
    return (
      <ModalBody onClose={close}>
        <ModalHeader>
          <ModalTitle mb={0}>
            <Trans
              i18nKey="inviteUser:inviteLink"
              values={{
                userRole
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
          {error && <Text color="red">{error.json.message}</Text>}
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
                  <Trans i18nKey="inviteUser:generateLink" />
                </Fragment>
              ) : (
                <Fragment>
                  <FaUserEdit style={styles.icon} />
                  <Trans i18nKey="inviteUser:updateMember" />
                </Fragment>
              )}
            </Button>
          </Box>
          {url !== "" ? (
            <Box flow={20}>
              <InfoBox type="info">
                <Trans
                  i18nKey="inviteUser:description"
                  values={{
                    userRole
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

export default connectData(InviteUser);
