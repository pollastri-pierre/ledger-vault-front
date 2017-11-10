//@flow
import _ from "lodash";
import React, { Component } from "react";
import { BlurDialog } from "../../containers";
import ModalLoading from "../../components/ModalLoading";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DialogButton, Overscroll } from "../";
import TabDetails from "./TabDetails";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import "./OperationDetails.css";
import connectData from "../../restlay/connectData";
import OperationQuery from "../../api/queries/OperationQuery";
import AccountsQuery from "../../api/queries/AccountsQuery";

class OperationDetails extends Component<
  {
    operation: *,
    tabsIndex: *,
    close: Function
  },
  *
> {
  state = {
    note: { author: {}, title: "" }
  };

  contentNode: *;

  handleChangeTitle = val => {
    const newNote = _.cloneDeep(this.state.note);
    newNote.title = val;
    this.setState({
      note: newNote
    });
  };

  close = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    const { operation } = this.props;
    if (operation && operation.notes && operation.notes.length > 0) {
      this.setState({
        note: operation.notes[0]
      });
    }
  }

  render() {
    const { operation } = this.props;

    return (
      <Tabs
        className="operation-details wrapper"
        defaultIndex={this.props.tabsIndex}
        onSelect={() => {}}
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
            <TabOverview operation={operation} />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <Overscroll>
              <TabDetails operation={operation} />
            </Overscroll>
          </TabPanel>
          <TabPanel className="tabs_panel">
            <TabLabel
              note={this.state.note}
              changeTitle={this.handleChangeTitle}
            />
          </TabPanel>
        </div>
        <div className="footer">
          <DialogButton highlight right onTouchTap={this.props.close}>
            Done
          </DialogButton>
        </div>
      </Tabs>
    );
  }
}

OperationDetails.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default connectData(OperationDetails, {
  queries: { operation: OperationQuery, accounts: AccountsQuery },
  propsToQueryParams: props => ({ operationId: props.operationId }),
  RenderLoading: ModalLoading
});
