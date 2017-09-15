import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DialogButton } from '../';
import './OperationDetails.css';
import '../../styles/modal.css';

class OperationsDetails extends Component {
  componentWillMount() {
    const { operations, getOperation, close } = this.props;
    if (true && !operations.isLoadingOperation) {
      getOperation(operations.operationInModal);
    }
  }

  render() {
    return (
      <div className='modal'>
        <h2>Operation's details</h2>
        <Tabs className="operation-details">
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Details</Tab>
            <Tab>Label</Tab>
          </TabList>
          <TabPanel>Overview content</TabPanel>
          <TabPanel>details content</TabPanel>
          <TabPanel>label content</TabPanel>
        </Tabs>
        <div className="footer">
          <DialogButton highlight right onTouchTap={this.props.close}>Done</DialogButton>
        </div>
      </div>
    );
  }

}


OperationsDetails.propTypes = {
  close: PropTypes.func.isRequired,
  getOperation: PropTypes.func.isRequired,
};

export default OperationsDetails;
