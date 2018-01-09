//@flow
import React, { Component } from "react";
import ModalLoading from "components/ModalLoading";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { DialogButton, Overscroll } from "../";
import TabDetails from "./TabDetails";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import connectData from "restlay/connectData";
import OperationWithAccountQuery from "api/queries/OperationWithAccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import type { Operation, Account, Member } from "data/types";
import Tabs, { Tab } from "material-ui/Tabs";
import modals from "shared/modals";

type Props = {
  close: Function,
  classes: Object,
  tabIndex: number,
  // injected by decorators:
  operationWithAccount: {
    operation: Operation,
    account: Account
  },
  profile: Member,
  history: *,
  match: Object
};

const styles = {
  base: {
    ...modals.base,
    width: "440px",
    height: "615px"
  }
};

class OperationDetails extends Component<Props, *> {
  constructor(props) {
    super(props);

    this.state = {
      value: parseInt(props.match.params.tabIndex, 10) || 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      operationWithAccount: { operation, account },
      close,
      classes
    } = this.props;
    const note = operation.notes[0];
    const { value } = this.state;

    return (
      <div className={classes.base}>
        <header>
          <h2>{"Operation's details"}</h2>
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Overview" disableRipple />
            <Tab label="Details" disableRipple />
            <Tab label="Label" disableRipple />
          </Tabs>
        </header>
        {value === 0 && <TabOverview operation={operation} account={account} />}
        {value === 1 && (
          <div style={{ height: "330px" }}>
            <Overscroll top={20} bottom={40}>
              <TabDetails operation={operation} account={account} />
            </Overscroll>
          </div>
        )}
        {value === 2 && <TabLabel note={note} />}
        <div className="footer">
          {operation.exploreURL ? (
            <DialogButton>
              <a target="_blank" href={operation.exploreURL}>
                Explore
              </a>
            </DialogButton>
          ) : null}
          <DialogButton highlight right onTouchTap={close}>
            Done
          </DialogButton>
        </div>
      </div>
    );
  }
}

OperationDetails.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default connectData(withStyles(styles)(OperationDetails), {
  RenderLoading: ModalLoading,
  queries: {
    operationWithAccount: OperationWithAccountQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({
    operationId: props.match.params.operationId || ""
  })
});
