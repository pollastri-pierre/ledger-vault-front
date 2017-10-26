import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from '../components';

import {
  closeModalOperation,
  changeTab,
  saveOperation,
  OPEN_MODAL_OPERATION,
} from '../redux/modules/operation-creation';

const mapStateToProps = state => ({
  modals: state.modals,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeModalOperation()),
  onChangeTab: index => dispatch(changeTab(index)),
  onSaveOperation: () => dispatch(saveOperation()),
});

function OperationModal(props) {
  const { onChangeTab, onClose, onSaveOperation, tabsIndex } = props;

  return (
    <div>
      {props.modals === OPEN_MODAL_OPERATION && (
        <Modal close={onClose}>
          <OperationCreation
            tabsIndex={tabsIndex}
            onSelect={onChangeTab}
            save={onSaveOperation}
            close={onClose}
          />
        </Modal>
      )}
    </div>
  );
}

OperationModal.propTypes = {
  onChangeTab: PropTypes.func.isRequired,
  onSaveOperation: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  tabsIndex: PropTypes.number.isRequired,
};

OperationModal.contextTypes = {
  translate: PropTypes.func.isRequired,
};

export { OperationModal as NOperationModal };

export default connect(mapStateToProps, mapDispatchToProps)(OperationModal);
