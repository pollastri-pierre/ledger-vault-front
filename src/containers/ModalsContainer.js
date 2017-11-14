// FIXME this file is deprecated. see the new approach of how new account, operation approve modals, etc.. are rendered

import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, OperationCreation } from "../components";
import { getAccounts } from "../redux/modules/accounts";
import { setBlurState } from "../containers/BlurDialog/BlurDialog";

import {
  closeModalOperation,
  changeTabOperation,
  saveOperation
} from "../redux/modules/operation-creation";

import {
  OperationDetails,
  AccountApprove,
  OperationApprove
} from "../components";

const mapStateToProps = state => ({
  modals: state.modals,
  organization: state.organization,
  accountCreation: state.accountCreation,
  operationCreation: state.operationCreation,
  accounts: state.accounts
});

const mapDispatchToProps = dispatch => ({
  onCloseModalOperation: from => dispatch(closeModalOperation(from)),
  onChangeTabOperation: index => dispatch(changeTabOperation(index)),
  onSaveOperation: () => dispatch(saveOperation()),
  onGetAccounts: () => dispatch(getAccounts())
});

class ModalWrap extends Component {
  componentDidMount() {
    setBlurState(true);
  }
  componentWillUnmount() {
    setBlurState(false);
  }
  render() {
    return <Modal {...this.props} />;
  }
}

function ModalsContainer(props) {
  const {
    organization,
    operations,
    operationCreation,
    accounts,
    onChangeTabOperation,
    onCloseModalOperation,
    onSaveOperation,
    onGetAccounts
  } = props;

  // TODO need to refactor this into the same style of the Profile Edit Modal
  // using react-router & rendering from contextual place

  return (
    <div>
      {operationCreation.modalOpened && (
        <ModalWrap close={onCloseModalOperation}>
          <OperationCreation
            close={onCloseModalOperation}
            onSelect={onChangeTabOperation}
            save={onSaveOperation}
            tabsIndex={operationCreation.currentTab}
            accounts={accounts}
            getAccounts={onGetAccounts}
          />
        </ModalWrap>
      )}
    </div>
  );
}

ModalsContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  operations: PropTypes.shape({}).isRequired
};

ModalsContainer.contextTypes = {
  translate: PropTypes.func.isRequired
};

export { ModalsContainer as NModalsContainer };

export default connect(mapStateToProps, mapDispatchToProps)(ModalsContainer);
