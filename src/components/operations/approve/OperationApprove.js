import React, { Component } from "react";
import ModalLoading from "../../../components/ModalLoading";
import api from "../../../data/api-spec";
import _ from "lodash";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CircularProgress from "material-ui/CircularProgress";
import { DialogButton, Overscroll } from "../../";
import AbortConfirmation from "../../approve/AbortConfirmation";
import ApproveDevice from "../../approve//ApproveDevice";
import OperationApproveDedails from "./OperationApproveDedails";
import OperationApproveApprovals from "./OperationApproveApprovals";
import OperationApproveLocks from "./OperationApproveLocks";
import ApprovalList from "../../ApprovalList";
import connectData from "../../../decorators/connectData";
import Footer from "../../approve/Footer";

class OperationApprove extends Component {
  constructor() {
    super();
    this.aborting = this.aborting.bind(this);
    this.approving = this.approving.bind(this);
    this.state = {};
  }

  aborting() {
    this.setState({ ...this.state, isAborting: !this.state.isAborting });
  }

  approving() {
    this.setState({ ...this.state, isDevice: !this.state.isDevice });
  }

  abort() {}

  render() {
    const { close, operation, members } = this.props;

    if (this.state.isAborting) {
      return (
        <AbortConfirmation
          aborting={this.aborting}
          abort={this.abort}
          entity="operation"
        />
      );
    }

    if (this.state.isDevice) {
      return <ApproveDevice cancel={this.approving} entity="operation" />;
    }

    return (
      <Tabs id="account-creation" className="wrapper loading">
        <div className="header">
          <h2>Operation request</h2>
          <TabList>
            <Tab>details</Tab>
            <Tab>approvals</Tab>
            <Tab>locks</Tab>
          </TabList>
        </div>
        <div className="content">
          <TabPanel className="tabs_panel">
            <OperationApproveDedails operation={operation} />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveApprovals
              members={members}
              operation={operation}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveLocks operation={operation} />
          </TabPanel>
        </div>
        <Footer
          close={close}
          approve={this.approving}
          aborting={this.aborting}
          approved={false}
        />
      </Tabs>
    );
  }
}

OperationApprove.propTypes = {
  getOperation: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  operation: PropTypes.shape({}).isRequired
};

export default connectData(OperationApprove, {
  api: { operation: api.operation, members: api.members },
  propsToApiParams: props => ({ operationId: props.operationId }),
  RenderLoading: ModalLoading
});
