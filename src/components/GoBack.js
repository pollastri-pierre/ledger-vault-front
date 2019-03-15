// @flow
import { PureComponent } from "react";
import type { MemoryHistory } from "history";

type Props = {
  history: MemoryHistory,
};

class GoBack extends PureComponent<Props> {
  componentDidMount() {
    const { history } = this.props;
    if (history.length > 0) {
      history.goBack();
    }
  }

  render() {
    return null;
  }
}

export default GoBack;
