// @flow
import { PureComponent } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

type Props = {
  history: MemoryHistory,
  match: Match
};

class GoBack extends PureComponent<Props> {
  componentDidMount() {
    const { history, match } = this.props;
    if (history.length > 0) {
      history.goBack();
    }
  }

  render() {
    return null;
  }
}

export default GoBack;
