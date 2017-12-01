//@flow
import React, { Component } from "react";
import ModalLoading from "../../components/ModalLoading";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DialogButton, Overscroll } from "../";
import TabDetails from "./TabDetails";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import "./OperationDetails.css";
import connectData from "../../restlay/connectData";
import OperationWithAccountQuery from "../../api/queries/OperationWithAccountQuery";
import ProfileQuery from "../../api/queries/ProfileQuery";
import type { Operation, Account, Member } from "../../data/types";

type Props = {
  close: Function,
  tabIndex: number,
  // injected by decorators:
  operationWithAccount: {
    operation: Operation,
    account: Account
  },
  profile: Member,
  history: *
};

class OperationDetails extends Component<Props> {
  contentNode: *;

  onSelect = (index: number) => {
    this.props.history.replace("" + index);
  };

  render() {
    const {
      operationWithAccount: { operation, account },
      close,
      tabIndex
    } = this.props;
    const note = operation.notes[0];
    return (
      <div className="operation-details modal">
        <Tabs
          className="wrapper"
          selectedIndex={tabIndex}
          onSelect={this.onSelect}
        >
          <div className="header">
            <h2>{"Operation's details"}</h2>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Details</Tab>
              <Tab>Label</Tab>
            </TabList>
          </div>
          <div
            className="content"
            ref={node => {
              this.contentNode = node;
            }}
          >
            <TabPanel className="tabs_panel">
              <TabOverview operation={operation} account={account} />
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll top={40} bottom={100}>
                <TabDetails operation={operation} account={account} />
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              {note ? <TabLabel note={note} /> : null}
            </TabPanel>
          </div>
          <div className="footer">
            {operation.exploreURL ? (
              <DialogButton>
                <a target="_blank" href={operation.exploreURL}>
                  Explore
                </a>
              </DialogButton>
            ) : null}
            <DialogButton highlight right onTouchTap={close}>
              Done
            </DialogButton>
          </div>
        </Tabs>
      </div>
    );
  }
}

OperationDetails.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default connectData(OperationDetails, {
  RenderLoading: ModalLoading,
  queries: {
    operationWithAccount: OperationWithAccountQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({
    operationId: props.match.params.operationId || ""
  })
});
