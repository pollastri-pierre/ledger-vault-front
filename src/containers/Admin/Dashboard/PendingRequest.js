// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import RequestQuery from "api/queries/RequestQuery";

import Box from "components/base/Box";
import { CardError } from "components/base/Card";
import {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "components/base/Modal";
import ModalLoading from "components/ModalLoading";

import type { Request } from "data/types";

import PendingRequestOverview from "./PendingRequestOverview";
import PendingRequestHistory from "./PendingRequestHistory";
import PendingRequestFooter from "./PendingRequestFooter";

type Props = {
  close: () => void,
  request: Request,
};

type State = {
  tabsIndex: number,
};

const tabTitles = ["Overview", "History"];

class PendingRequest extends PureComponent<Props, State> {
  state = {
    tabsIndex: 0,
  };

  onTabChange = (e: SyntheticEvent<HTMLInputElement>, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { close, request } = this.props;
    const { tabsIndex } = this.state;
    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>New User Request</ModalTitle>
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
          {tabsIndex === 0 && <PendingRequestOverview request={request} />}
          {tabsIndex === 1 && <PendingRequestHistory request={request} />}
        </Box>
        <ModalFooter justify="space-between">
          <PendingRequestFooter
            requestID={request.id}
            onSuccess={this.onSuccess}
            onError={null}
          />
        </ModalFooter>
      </ModalBody>
    );
  }
}

const RenderLoading = () => <ModalLoading height={700} />;

export default connectData(PendingRequest, {
  RenderLoading,
  RenderError: CardError,
  queries: {
    request: RequestQuery,
  },
  propsToQueryParams: props => ({
    requestID: props.match.params.requestID || "",
  }),
});
