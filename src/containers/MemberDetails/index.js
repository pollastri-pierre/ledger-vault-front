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
  ModalFooter
} from "components/base/Modal";

import MemberDetailsOverview from "./MD-Overview";
import MemberDetailsHistory from "./MD-History";
import MemberDetailsFooter from "./MD-Footer";

type Props = {
  member: Member,
  close: () => void
};

type State = {
  tabsIndex: number
};

const tabTitles = ["Overview", "History"];

// NOTE: can be generalized more if needed. so far details modal is identical for admins and operators
class MemberDetails extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tabsIndex: 0
    };
  }

  onTabChange = (e: SyntheticEvent<HTMLInputElement>, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  render() {
    const { close, member } = this.props;
    const { tabsIndex } = this.state;

    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>
            <Trans
              i18nKey="memberDetails:header"
              values={{
                memberRole: member.role
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
          {tabsIndex === 0 && <MemberDetailsOverview member={member} />}
          {tabsIndex === 1 && <MemberDetailsHistory member={member} />}
        </Box>
        <ModalFooter>
          <MemberDetailsFooter status={member.status} />
        </ModalFooter>
      </ModalBody>
    );
  }
}

export default MemberDetails;
