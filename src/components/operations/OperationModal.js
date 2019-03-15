// @flow
import React, { Component } from "react";
import type { MemoryHistory } from "history";
import { translate } from "react-i18next";
import OperationDetails from "./OperationDetails";

type Props = {
  history: MemoryHistory,
  match: Object,
  close: () => void,
};

class OperationModal extends Component<Props> {
  render() {
    const index = parseInt(this.props.match.params.tabIndex, 10);
    const { match, history } = this.props;
    return (
      <OperationDetails
        close={this.props.close}
        tabIndex={index}
        match={match}
        history={history}
      />
    );
  }
}

export default translate()(OperationModal);
