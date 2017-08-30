import React from 'react';
import PropTypes from 'prop-types';
import BlurDialog from './BlurDialog';
import TabBar from './TabBar'
import asTab from './Tab';
import translate from './translate';
import OperationDetailOverview from './OperationDetailOverview';
import './OperationsDetail.css';

class OperationsDetail extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log('OperationsDetail MOUNT', this)
  }

  componentWillReceiveProps(props) {
    console.log('OperationsDetail props', this, props)
  }

  componentWillUpdate() {
    console.log('OperationsDetail update', this)
  }

  componentWillUnmount() {
    console.log('OperationsDetail unmount')
  }

  render() {
    return (
      <BlurDialog
        open={this.props.dialogOpen}
        onRequestClose={this.props.hideDialog}
      >
        <TabBar 
          id="popol"
          sequential
          tabs={[
            {
              title: this.t('operation.overview'),
              content: OperationDetailOverview,
              props: { tx: this.tx },
            },
          ]} 
        
        />
      </BlurDialog>
    );
  }
}

OperationsDetail.propTypes = {
  children: PropTypes.node,
  style: PropTypes.shape({}),
};

OperationsDetail.defaultProps = {
  children: '',
  style: {},
};

export default translate(OperationsDetail);
