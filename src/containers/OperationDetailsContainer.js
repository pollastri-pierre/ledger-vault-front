import React from 'react';
import PropTypes from 'prop-types';
// import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { getOperation, close } from '../redux/modules/operations';
import { BlurDialog } from '../containers';
import { OperationDetails } from '../components';
// import _ from 'lodash';

const mapStateToProps = state => ({
  operations: state.operations,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onGetOperation: id => dispatch(getOperation(id)),
});

function OperationDetailsContainer(props) {
  const { operations, onClose } = props;
  return (
    <div>
      <BlurDialog
        open={(operations.operationInModal !== null)}
        onRequestClose={onClose}
      >
        <OperationDetails
          operations={operations}
          getOperation={props.onGetOperation}
          close={props.onClose}
        />
      </BlurDialog>
    </div>
  );
}

OperationDetailsContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGetOperation: PropTypes.func.isRequired,
  operations: PropTypes.shape({}).isRequired,
};

OperationDetailsContainer.contextTypes = {
  translate: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OperationDetailsContainer);

