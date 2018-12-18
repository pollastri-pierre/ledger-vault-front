//@flow
import React, { Component } from "react";
import type { Account } from "data/types";
import { connect } from "react-redux";
import { toggleAndSelect } from "redux/modules/update-accounts";

type Props = {
  children: *,
  account: Account,
  onOpen: Function,
  className: ?string
};
class EditButton extends Component<Props> {
  render() {
    const { children, className, onOpen } = this.props;
    return (
      <div onClick={onOpen} className={className && className}>
        {children}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Function, ownProps: $Shape<Props>) => ({
  onOpen: () => dispatch(toggleAndSelect(ownProps.account))
});
export default connect(
  null,
  mapDispatchToProps
)(EditButton);
