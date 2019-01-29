// @flow
import React, { Component } from "react";
import TryAgain from "components/TryAgain";
import { Trans, Interpolate } from "react-i18next";
import connectData from "restlay/connectData";
import MembersQuery from "api/queries/MembersQuery";
import ModalLoading from "components/ModalLoading";
import MemberRow from "components/MemberRow";
import { DialogButton, Overscroll } from "components";
import type { Member } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import modals from "shared/modals";
import colors from "shared/colors";
import Text from "components/Text";

const styleCounter = {
  base: {
    color: colors.lead
  }
};
const SelectedCounter = withStyles(styleCounter)(
  ({ count, classes }: { count: number, classes: Object }) => (
    <Text bold small uppercase className={classes.base}>
      <Interpolate
        i18nKey="newAccount:security.members_selected"
        options={{ count }}
        nbMembersSelected={count}
      />
    </Text>
  )
);

const styles = {
  base: {
    ...modals.base,
    width: 450,
    height: 615,
    "& h2": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  },
  content: {
    height: 350
  }
};
class ListApprovers extends Component<{
  goBack: Function,
  members: Member[],
  approvers: Member[],
  addMember: Function,
  classes: Object
}> {
  render() {
    const { goBack, members, addMember, approvers, classes } = this.props;

    return (
      <div className={classes.base}>
        <header>
          <h2>
            <Trans i18nKey="newAccount:security.members" />
            {approvers.length > 0 && (
              <SelectedCounter count={approvers.length} />
            )}
          </h2>
          <Text>
            <Trans i18nKey="newAccount:security.members_desc" />
          </Text>
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
          <DialogButton right highlight onTouchTap={goBack}>
            <Trans i18nKey="common:done" />
          </DialogButton>
        </div>
      </div>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <div style={{ width: 450, height: 615 }}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
);

export default connectData(withStyles(styles)(ListApprovers), {
  RenderLoading: ModalLoading,
  RenderError,
  queries: {
    members: MembersQuery
  }
});
