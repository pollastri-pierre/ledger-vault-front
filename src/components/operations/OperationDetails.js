import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DialogButton, Overscroll } from '../';
import TabDetails from './TabDetails';
import TabOverview from './TabOverview';
import TabLabel from './TabLabel';
import './OperationDetails.css';
import operationsUtils from '../../redux/utils/operation';
// import { Overscroll } from '../../components';

class OperationsDetails extends Component {
  constructor(props) {
    super(props);

    let note = { author: {} };

    this.state = {
      note: note,
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
  }

  componentWillMount() {
    const { operations, getOperation } = this.props;
    if (true && !operations.isLoadingOperation) {
      getOperation(operations.operationInModal);
    }
  }

  componentWillReceiveProps(props) {
    const operation = operationsUtils.findOperationDetails(
      props.operations.operationInModal,
      props.operations.operations,
    );  

    if (operation && operation.notes && operation.notes.length > 0) {
      this.setState({
        note: operation.notes[0],
      });  
    }  
  }

  // componentDidUpdate() {
  //   const content = this.contentNode;
  //   const height = `${content.clientHeight - 80}px`;
  //   const original = content.querySelector('.original');
  //   const copy = content.querySelector('.copy');

  //   original.style.height = height;
  //   copy.style.height = height;

  //   original.addEventListener('scroll', this.onScroll);
  // }

  // onScroll = () => {
  //   const original = this.contentNode.querySelector('.original');
  //   const copy = this.contentNode.querySelector('.copy');

  //   copy.scrollTop = original.scrollTop;
  // };

  handleChangeTitle = (val) => {
    const newNote = _.cloneDeep(this.state.note);
    newNote.title = val;

    this.setState({
      note: newNote,
    });
  }

  render() {
    const { operations } = this.props;
    const { translate } = this.context;

    const operation = operationsUtils.findOperationDetails(
      operations.operationInModal,
      operations.operations,
    );

    const overview = <TabOverview operation={operation} />;
    const details = <TabDetails operation={operation} />;
    const label = <TabLabel note={this.state.note} changeTitle={this.handleChangeTitle} />;

    return (
      <div>
        {(operations.isLoadingOperation || !operation) ?
          <div className="operation-details wrapper">
            <div className="modal-loading">
              <CircularProgress />
            </div>
            <div className="footer">
              <DialogButton highlight right onTouchTap={this.props.close}>Done</DialogButton>
            </div>
          </div>
          :
          <Tabs className="operation-details wrapper" defaultIndex={this.props.tabsIndex} onSelect={() => {}}>
            <div className="header">
              <h2>{ translate('operations.detailsTitle') }</h2>
              <TabList>
                <Tab>{ translate('operations.overview') }</Tab>
                <Tab>{ translate('operations.details') }</Tab>
                <Tab>{ translate('operations.label') }</Tab>
              </TabList>
            </div>
            <div className="content" ref={(node) => { this.contentNode = node; }}>
              <TabPanel className='tabs_panel'>
                <Overscroll
                  height={200}
                  overscrollSize={40}
                  background="white"
                >
                  {overview}
                </Overscroll>
              </TabPanel>
              <TabPanel className='tabs_panel'>
                <Overscroll
                  height={200}
                  overscrollSize={40}
                  background="white"
                >
                  {details}
                </Overscroll>
              </TabPanel>
              <TabPanel className='tabs_panel'>
                <Overscroll
                  height={200}
                  overscrollSize={40}
                  background="white"
                >
                  {label}
                </Overscroll>
              </TabPanel>
            </div>
            <div className="footer">
              <DialogButton highlight right onTouchTap={this.props.close}>Done</DialogButton>
            </div>
          </Tabs>
        }
      </div>
    );
  }
}


OperationsDetails.propTypes = {
  close: PropTypes.func.isRequired,
  getOperation: PropTypes.func.isRequired,
  operations: PropTypes.shape({}).isRequired,
};

OperationsDetails.contextTypes = {
  translate: PropTypes.func.isRequired,
};

export default OperationsDetails;
