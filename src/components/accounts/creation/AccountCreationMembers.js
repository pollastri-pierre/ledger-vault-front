// @flow
import React, { Component } from "react";
import TryAgain from "components/TryAgain";
import { translate } from "react-i18next";
import connectData from "restlay/connectData";
import MembersQuery from "api/queries/MembersQuery";
import ModalLoading from "components/ModalLoading";
import MemberRow from "components/MemberRow";
import InfoModal from "components/InfoModal";
import { DialogButton, Overscroll } from "components";
import type { Member, Translate } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import modals from "shared/modals";

const styleCounter = {
  base: {
    textTransform: "uppercase",
    fontSize: "10px",
    color: "#999",
    fontWeight: "600",
    float: "right",
    marginTop: "-42px"
  }
};
const SelectedCounter = withStyles(styleCounter)(
  ({ count, classes }: { count: number, classes: Object }) => {
    if (count === 0) {
      return false;
    }
    if (count === 1) {
      return <span className={classes.base}>{count} member selected</span>;
    }
    return <span className={classes.base}>{count} members selected</span>;
  }
);

const styles = {
  base: {
    ...modals.base,
    width: 450,
    height: 615
  },
  content: {
    height: 350
  }
};
class AccountCreationMembers extends Component<{
  switchInternalModal: Function,
  addMember: Function,
  members: Member[],
  approvers: string[],
  t: Translate,
  classes: Object
}> {
  render() {
    const {
      switchInternalModal,
      addMember,
      members,
      t,
      approvers,
      classes
    } = this.props;

    return (
      <div className={classes.base}>
        <header>
          <h2>{t("newAccount:security.members")}</h2>
          <SelectedCounter count={approvers.length} />
          <InfoModal>{t("newAccount:security.members_desc")}</InfoModal>
        </header>
        <div className={classes.content}>
          <Overscroll top={20} bottom={0}>
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

const RenderError = translate()(({ error, restlay }: *) => (
  <div style={{ width: 450, height: 615 }}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
));

export default connectData(
  withStyles(styles)(translate()(AccountCreationMembers)),
  {
    RenderLoading: ModalLoading,
    RenderError,
    queries: {
      members: MembersQuery
    }
  }
);
