// @flow

import React, { PureComponent } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import type { Member } from "data/types";
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "components/base/Modal";

import UserDetailsOverview from "./UD-Overview";
import UserDetailsHistory from "./UD-History";
import UserDetailsFooter from "./UD-Footer";

type Props = {
  user: Member,
  close: () => void,
};

type State = {
  tabsIndex: number,
};

const tabTitles = ["Overview", "History"];

// NOTE: can be generalized more if needed. so far details modal is identical for admins and operators
class UserDetails extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tabsIndex: 0,
    };
  }

  onTabChange = (e: SyntheticEvent<HTMLInputElement>, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  render() {
    const { close, user } = this.props;
    const { tabsIndex } = this.state;

    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>
            <Trans
              i18nKey="userDetails:header"
              values={{
                userRole: user.role,
              }}
            />
          </ModalTitle>
          <Tabs
            indicatorColor="primary"
            value={tabsIndex}
            onChange={this.onTabChange}
          >
            {tabTitles.map((title, i) => (
              <Tab
                key={i} // eslint-disable-line react/no-array-index-key
                label={title}
                disableRipple
              />
            ))}
          </Tabs>
        </ModalHeader>
        <Box>
          {tabsIndex === 0 && <UserDetailsOverview user={user} />}
          {tabsIndex === 1 && <UserDetailsHistory user={user} />}
        </Box>
        <ModalFooter>
          <UserDetailsFooter status={user.status} />
        </ModalFooter>
      </ModalBody>
    );
  }
}

export default UserDetails;
