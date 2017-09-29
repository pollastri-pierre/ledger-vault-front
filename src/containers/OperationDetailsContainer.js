import React from 'react';
import PropTypes from 'prop-types';
// import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { getOperation, getOperationFake, close } from '../redux/modules/operations';
import {
  closeModalAccount,
  changeTab,
  selectCurrency,
  changeAccountName,
} from '../redux/modules/account-creation';

import { getCurrencies } from '../redux/modules/all-currencies';
import { BlurDialog } from '../containers';
import { OperationDetails } from '../components';
import { AccountCreation } from '../components';
// import _ from 'lodash';

const mapStateToProps = state => ({
  operations: state.operations,
  accountCreation: state.accountCreation,
  allCurrencies: state.allCurrencies,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onCloseAccount: () => dispatch(closeModalAccount()),
  onGetOperation: id => dispatch(getOperationFake(id)),
  onChangeTabAccount: index => dispatch(changeTab(index)),
  onGetCurrencies: () => dispatch(getCurrencies()),
  onSelectCurrency: (c) => dispatch(selectCurrency(c)),
  onChangeAccountName: (n) => dispatch(changeAccountName(n)),
});

function OperationDetailsContainer(props) {
  const { onChangeTabAccount,
    operations,
    allCurrencies,
    onClose,
    accountCreation,
    onGetCurrencies,
    onSelectCurrency,
    onChangeAccountName,
    onCloseAccount } = props;

  return (
    <div>
      <BlurDialog
        className="modal"
        open={(operations.operationInModal !== null)}
        onRequestClose={onClose}
        nopadding
      >
        <OperationDetails
          operations={operations}
          getOperation={props.onGetOperation}
          close={props.onClose}
          tabsIndex={operations.tabsIndex}
        />
      </BlurDialog>
      <BlurDialog
        className="modal"
        open={(accountCreation.modalOpened)}
        onRequestClose={onCloseAccount}
        nopadding
      >
        <AccountCreation
          tabsIndex={accountCreation.currentTab}
          onSelect={onChangeTabAccount}
          getCurrencies={onGetCurrencies}
          selectCurrency={onSelectCurrency}
          changeAccountName={onChangeAccountName}
          currencies={allCurrencies}
          account={accountCreation}
          close={onCloseAccount}
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

