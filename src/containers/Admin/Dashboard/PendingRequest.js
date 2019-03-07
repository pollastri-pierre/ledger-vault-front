// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { connect } from "react-redux";
import { NetworkError } from "network";

import RequestQuery from "api/queries/RequestQuery";
import { addMessage, addError } from "redux/modules/alerts";
import { NoChannelForDevice, GenericError } from "utils/errors";

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
  request: Request,
  addMessage: (string, string, ?string) => void,
  addError: Error => void
};

type State = {
  tabsIndex: number
};

const mapDispatchToProps = {
  addMessage,
  addError
};

const tabTitles = ["Overview", "History"];

class PendingRequest extends PureComponent<Props, State> {
  state = {
    tabsIndex: 0
  };

  onTabChange = (e: SyntheticEvent<HTMLInputElement>, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  // TODO: externalize onError, maybe with a switch for different types, it is similar in other places
  onError = (e: Error | GateError) => {
    if (e instanceof NetworkError && e.json) {
      this.props.addMessage(`Error ${e.json.code}`, e.json.message, "error");
    } else if (e instanceof NoChannelForDevice) {
      this.props.addError(e);
    } else {
      this.props.addError(new GenericError());
    }
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
            onError={this.onError}
          />
        </ModalFooter>
      </ModalBody>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(
  connectData(PendingRequest, {
    RenderLoading: CardLoading,
    RenderError: CardError,
    queries: {
      request: RequestQuery
    },
    propsToQueryParams: props => ({
      requestID: props.match.params.requestID || ""
    })
  })
);
