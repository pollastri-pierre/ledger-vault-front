import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, OperationCreation } from "../components";
import { getAccounts } from "../redux/modules/accounts";
import { setBlurState } from "../containers/BlurDialog/BlurDialog";
import { close } from "../redux/modules/operations";

import {
  closeModalOperation,
  changeTabOperation,
  saveOperation
} from "../redux/modules/operation-creation";

import { closeApprove } from "../redux/modules/entity-approve";

import {
  OperationDetails,
  AccountApprove,
  OperationApprove
} from "../components";

const mapStateToProps = state => ({
  modals: state.modals,
  operations: state.operations,
  organization: state.organization,
  accountCreation: state.accountCreation,
  operationCreation: state.operationCreation,
  accounts: state.accounts,
  entityToApprove: state.entityApprove
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onCloseModalOperation: from => dispatch(closeModalOperation(from)),
  onChangeTabOperation: index => dispatch(changeTabOperation(index)),
  onSaveOperation: () => dispatch(saveOperation()),
  onGetAccounts: () => dispatch(getAccounts()),
  onCloseApprove: () => dispatch(closeApprove())
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
    entityToApprove,
    organization,
    operations,
    onGetOrganizationApprovers,
    operationCreation,
    accounts,
    onChangeTabOperation,
    onCloseModalOperation,
    onSaveOperation,
    onGetAccounts,
    onGetOperationToApprove,
    onCloseApprove,
    onGetAccountToApprove
  } = props;

  // TODO need to refactor this into the same style of the Profile Edit Modal
  // using react-router & rendering from contextual place

  return (
    <div>
      {entityToApprove.modalOpened &&
        entityToApprove.entity === "operation" && (
          <ModalWrap close={onCloseApprove}>
            <OperationApprove
              operationId={entityToApprove.entityId}
              close={onCloseApprove}
            />
          </ModalWrap>
        )}
      {entityToApprove.modalOpened &&
        entityToApprove.entity === "account" && (
          <ModalWrap close={onCloseApprove}>
            <AccountApprove
              accountId={entityToApprove.entityId}
              close={onCloseApprove}
            />
          </ModalWrap>
        )}
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
      {operations.operationInModal !== null &&
        !_.isUndefined(operations.operationInModal) && (
          <ModalWrap close={props.onClose}>
            <OperationDetails
              close={props.onClose}
              operationId={operations.operationInModal}
              tabsIndex={operations.tabsIndex}
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
