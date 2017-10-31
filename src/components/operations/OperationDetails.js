import _ from "lodash";
import React, { Component } from "react";
import api from "../../data/api-spec";
import ModalLoading from "../../components/ModalLoading";
import PropTypes from "prop-types";
import CircularProgress from "material-ui/CircularProgress";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DialogButton, Overscroll } from "../";
import TabDetails from "./TabDetails";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import "./OperationDetails.css";
import connectData from "../../decorators/connectData";
import operationsUtils from "../../redux/utils/operation";

class OperationDetails extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    let note = { author: {} };

    this.state = {
      note: note
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
  }

  handleChangeTitle = val => {
    const newNote = _.cloneDeep(this.state.note);
    newNote.title = val;

    this.setState({
      note: newNote
    });
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
          <h2>Operation's details</h2>
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
            <Overscroll>
              <TabOverview operation={operation} />
            </Overscroll>
          </TabPanel>
          <TabPanel className="tabs_panel">
            <Overscroll>
              <TabDetails operation={operation} />
            </Overscroll>
          </TabPanel>
          <TabPanel className="tabs_panel">
            <Overscroll>
              <TabLabel
                note={this.state.note}
                changeTitle={this.handleChangeTitle}
              />
            </Overscroll>
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

OperationDetails.propTypes = {
  close: PropTypes.func.isRequired
};

OperationDetails.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default connectData(OperationDetails, {
  api: { operation: api.operation },
  propsToApiParams: props => ({ operationId: props.operationId }),
  RenderLoading: ModalLoading
});
