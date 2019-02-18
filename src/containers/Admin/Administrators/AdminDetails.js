// @flow

import React, { PureComponent } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import connectData from "restlay/connectData";
import MemberQuery from "api/queries/MemberQuery";
import { Trans } from "react-i18next";
import Text from "components/base/Text";
import Box from "components/base/Box";
import type { Member } from "data/types";
import ModalHeader from "components/base/Modal/ModalHeader";
import ModalBody from "components/base/Modal/ModalBody";
import SpinnerCard from "components/spinners/SpinnerCard";

import MemberDetailsOverview from "containers/MemberDetails/MD-Overview";
import MemberDetailsHistory from "containers/MemberDetails/MD-History";
import MemberDetailsFooter from "containers/MemberDetails/MD-Footer";

type Props = {
  admin: Member,
  close: () => void
};

type State = {
  tabsIndex: number
};

const tabTitles = ["Overview", "History"];

class AdminDetails extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      tabsIndex: 0
    };
  }

  onTabChange = (e, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  onChange = () => {};

  render() {
    const { close, admin } = this.props;
    const { tabsIndex } = this.state;

    return (
      <Box width={450} p={15}>
        <ModalHeader
          onClose={close}
          title={<Trans i18nKey="memberDetails:header" />}
        />
        <ModalBody>
          <Box>
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
            <Box>
              {tabsIndex === 0 && <MemberDetailsOverview member={admin} />}
              {tabsIndex === 1 && <MemberDetailsHistory member={admin} />}
            </Box>
          </Box>
        </ModalBody>
        <MemberDetailsFooter status={admin.status} />
      </Box>
    );
  }
}

const RenderLoading = () => <SpinnerCard />;
const RenderError = () => <Text>Render error todo</Text>;

export default connectData(AdminDetails, {
  RenderError,
  RenderLoading,
  queries: {
    admin: MemberQuery
  },
  propsToQueryParams: props => ({
    memberId: props.match.params.memberId || ""
  })
});
