// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import RequestQuery from "api/queries/RequestQuery";

import Box from "components/base/Box";
import { CardLoading, CardError } from "components/base/Card";
import {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter
} from "components/base/Modal";

import type { GateError, Request } from "data/types";

import PendingRequestOverview from "./PendingRequestOverview";
import PendingRequestHistory from "./PendingRequestHistory";
import PendingRequestFooter from "./PendingRequestFooter";

type Props = {
  close: () => void,
  request: Request
};

type State = {
  tabsIndex: number,
  error: ?GateError
};
const tabTitles = ["Overview", "History"];

class PendingRequest extends PureComponent<Props, State> {
  state = {
    tabsIndex: 0,
    error: null
  };

  onTabChange = (e: SyntheticEvent<HTMLInputElement>, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  onError = (error: GateError) => {
    if (error.json) {
      this.setState({ error });
    } else {
      console.warn(error);
    }
  };

  render() {
    const { close, request } = this.props;
    const { tabsIndex, error } = this.state;
    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>HEADER</ModalTitle>
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
          {tabsIndex === 0 && (
            <PendingRequestOverview request={request} error={error} />
          )}
          {tabsIndex === 1 && <PendingRequestHistory request={request} />}
        </Box>
        <ModalFooter justify="space-between">
          <PendingRequestFooter
            requestID={request.id}
            onSuccess={this.onSuccess}
            onError={this.onError}
          />
        </ModalFooter>
      </ModalBody>
    );
  }
}

export default connectData(PendingRequest, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    request: RequestQuery
  },
  propsToQueryParams: props => ({
    requestID: props.match.params.requestID || ""
  })
});
