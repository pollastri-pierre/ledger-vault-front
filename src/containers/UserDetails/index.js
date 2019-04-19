// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { FaUser } from "react-icons/fa";
import ApproveRequestButton from "components/ApproveRequestButton";
import EntityLastRequest from "components/EntityLastRequest";
import RequestActionButtons from "components/RequestActionButtons";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { TabName } from "containers/Admin/Groups/GroupDetails";
import type { User } from "data/types";
import { ModalClose } from "components/base/Modal";
import colors from "shared/colors";
import { createAndApprove } from "device/interactions/approveFlow";

import { hasPendingRequest } from "utils/entities";
import UserDetailsOverview from "./UD-Overview";
import UserDetailsHistory from "./UD-History";

type Props = {
  user: User,
  close: () => void,
};

type State = {
  tabsIndex: number,
};

// NOTE: can be generalized more if needed. so far details modal is identical for admins and operators
class UserDetails extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tabsIndex: 0,
    };
  }

  onTabChange = (tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  render() {
    const { close, user } = this.props;
    const { status } = user;
    const { tabsIndex } = this.state;

    return (
      <Box width={700} style={{ minHeight: 600 }} position="relative">
        <ModalClose onClick={close} />
        <Box bg="#f5f5f5" p={40} pb={0} flow={20} style={styles.header}>
          <Box horizontal align="center" flow={10}>
            <FaUser size={24} color="#ddd" />
            <Text large color="#aaa">
              {user.username}
            </Text>
          </Box>
          <Box horizontal flow={15} justify="space-between">
            <Box horizontal align="center">
              <TabName
                isActive={tabsIndex === 0}
                onClick={() => this.onTabChange(0)}
              >
                <Text uppercase small>
                  Overview
                </Text>
              </TabName>
              <TabName
                isActive={tabsIndex === 1}
                onClick={() => this.onTabChange(1)}
              >
                <Text uppercase small>
                  History
                </Text>
              </TabName>
            </Box>
            <Box horizontal align="center" flow={20}>
              <TabName
                isActive={tabsIndex === 2}
                onClick={() => this.onTabChange(2)}
              >
                <Text uppercase small>
                  LAST REQUEST
                </Text>
              </TabName>
            </Box>
          </Box>
        </Box>

        <Box grow p={40} pb={100} style={styles.content}>
          {tabsIndex === 0 && <UserDetailsOverview user={user} />}
          {tabsIndex === 1 && <UserDetailsHistory user={user} />}
          {tabsIndex === 2 && <EntityLastRequest entity={user} />}
        </Box>
        <Box px={10} style={styles.footer}>
          {status !== "PENDING_REGISTRATION" && hasPendingRequest(user) && (
            <RequestActionButtons
              onSuccess={close}
              onError={null}
              entity={user}
            />
          )}
          {status === "ACTIVE" && tabsIndex < 2 && !hasPendingRequest(user) && (
            <Box style={{ width: 200 }}>
              <ApproveRequestButton
                interactions={createAndApprove}
                onSuccess={close}
                color={colors.grenade}
                onError={null}
                isRevoke
                disabled={false}
                additionalFields={{
                  data: { user_id: user.id },
                  type: "REVOKE_USER",
                }}
                buttonLabel={<Trans i18nKey="common:revoke" />}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

export default UserDetails;

const styles = {
  header: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    userSelect: "none",
  },
  footer: {
    padding: 0,
  },
  content: {
    userSelect: "none",
  },
  checkOrNumber: {
    width: 10,
  },
};
