// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import InviteUserMutation from "api/mutations/InviteUserMutation";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import { ModalHeader, ModalTitle, ModalBody } from "components/base/Modal";
import CopyToClipboardButton from "components/CopyToClipboardButton";
import colors from "shared/colors";
import type { RestlayEnvironment } from "restlay/connectData";

import { updateUserRegistrationInfo } from "./helpers";
import InviteUserForm from "./InviteUserForm";

type Props = {
  close: () => void,
  restlay: RestlayEnvironment,
};
type State = {
  url: string,
  request_id: string,
};

const styles = {
  copyText: {
    color: colors.steel,
    fontWeight: "bold",
  },
};

class InviteUser extends PureComponent<Props, State> {
  state = {
    url: "",
    request_id: "",
  };

  processUserInfo = async (
    username: string,
    user_id: string,
    userRole: string,
  ) => {
    const { restlay } = this.props;
    const { request_id } = this.state;
    if (request_id) {
      try {
        await updateUserRegistrationInfo(
          request_id,
          {
            username,
            user_id,
          },
          restlay,
        );
        this.props.close();
      } catch (error) {
        console.warn(error);
      }
    } else {
      const query = new InviteUserMutation({
        user: {
          type:
            userRole === "Administrator" ? "CREATE_ADMIN" : "CREATE_OPERATOR",
          username,
          user_id,
        },
      });

      try {
        const data = await restlay.fetchQuery(query);
        const prefix = window.location.pathname.split("/")[1];
        const url = `${window.location.origin}/${prefix}/register/${
          data.url_id
        }`;
        this.setState({
          url,
          request_id: data.id,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  render() {
    const { close } = this.props;
    const { url, request_id } = this.state;

    return (
      <ModalBody onClose={close}>
        <ModalHeader>
          <ModalTitle mb={0}>
            <Trans i18nKey="inviteUser:inviteLink" />
          </ModalTitle>
        </ModalHeader>
        <InviteUserForm
          close={close}
          request_id={request_id}
          processUserInfo={this.processUserInfo}
        />
        {url !== "" ? (
          <Box flow={20} mt={20}>
            <InfoBox type="info">
              <Trans i18nKey="inviteUser:description" />
            </InfoBox>
            <Box p={5} bg={colors.cream} borderRadius={5}>
              <CopyToClipboardButton
                visible
                style={styles.copyText}
                textToCopy={url}
              />
            </Box>
          </Box>
        ) : null}
      </ModalBody>
    );
  }
}

export default connectData(InviteUser);
