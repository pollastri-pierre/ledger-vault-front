//@flow
import React, { Component } from "react";
import connectData from "../../../restlay/connectData";
import MembersQuery from "../../../api/queries/MembersQuery";
import ModalLoading from "../../../components/ModalLoading";
import MemberRow from "../../../components/MemberRow";
import InfoModal from "../../../components/InfoModal";
import { DialogButton, Overscroll } from "../../../components";
import type { Member } from "../../../data/types";
import { withStyles } from "material-ui/styles";
import modals from "../../../shared/modals";

const styleCounter = {
  base: {
    textTransform: "uppercase",
    fontSize: "10px",
    color: "#999",
    fontWeight: "600",
    float: "right",
    marginTop: "-57px"
  }
};
const SelectedCounter = withStyles(
  styleCounter
)(({ count, classes }: { count: number, classes: Object }) => {
  if (count === 0) {
    return false;
  }
  if (count === 1) {
    return <span className={classes.base}>{count} member selected</span>;
  }
  return <span className={classes.base}>{count} members selected</span>;
});

const styles = {
  base: {
    ...modals.base,
    width: "440px",
    height: "615px"
  },
  content: {
    height: 330
  }
};
class AccountCreationMembers extends Component<{
  switchInternalModal: Function,
  addMember: Function,
  members: Member[],
  approvers: string[],
  classes: Object
}> {
  render() {
    const {
      switchInternalModal,
      addMember,
      members,
      approvers,
      classes
    } = this.props;

    return (
      <div className={classes.base}>
        <header>
          <h2>Members</h2>
          <SelectedCounter count={approvers.length} />
          <InfoModal>
            Members define the group of individuals that have the ability to
            approve outgoing operations from this account.
          </InfoModal>
        </header>
        <div className={classes.content}>
          <Overscroll top={40} bottom={98}>
            {members.map(member => {
              const isChecked = approvers.indexOf(member.pub_key) > -1;
              return (
                <MemberRow
                  key={member.id}
                  member={member}
                  checked={isChecked}
                  onSelect={addMember}
                />
              );
            })}
          </Overscroll>
        </div>
        <div className="footer">
          <DialogButton
            right
            highlight
            onTouchTap={() => switchInternalModal("main")}
          >
            Done
          </DialogButton>
        </div>
      </div>
    );
  }
}

export default connectData(withStyles(styles)(AccountCreationMembers), {
  RenderLoading: ModalLoading,
  queries: {
    members: MembersQuery
  }
});
