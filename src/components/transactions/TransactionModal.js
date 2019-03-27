// @flow
import React, { Component } from "react";
import type { MemoryHistory } from "history";
import { translate } from "react-i18next";
import TransactionDetails from "./TransactionDetails";

type Props = {
  history: MemoryHistory,
  match: Object,
  close: () => void,
};

class TransactionModal extends Component<Props> {
  render() {
    const index = parseInt(this.props.match.params.tabIndex, 10);
    const { match, history } = this.props;
    return (
      <TransactionDetails
        close={this.props.close}
        tabIndex={index}
        match={match}
        history={history}
      />
    );
  }
}

export default translate()(TransactionModal);
