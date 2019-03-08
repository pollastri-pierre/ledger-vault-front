// @flow
import React, { Component } from "react";
import type { Match } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import MenuList from "@material-ui/core/MenuList";
import { FaUserCircle } from "react-icons/fa";
import { mixinHoverSelected } from "shared/common";
import colors from "shared/colors";
import type { Member } from "data/types";
import Text from "components/base/Text";
import MenuLink from "components/MenuLink";
import { withMe } from "components/UserContextProvider";
import PopBubble from "../utils/PopBubble";

const styles = {
  base: {
    ...mixinHoverSelected("white", "0px"),
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textDecoration: "none",
    paddingLeft: 40,
    marginBottom: 49,
    position: "absolute",
    bottom: "0",
    opacity: "1"
  },
  profile_info: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 15
  },
  userName: {
    textTransform: "capitalize"
  },
  userRole: {
    color: colors.lead
  },
  popover: {
    paddingLeft: 0,
    marginLeft: 50
  }
};

type Props = {
  me: Member,
  classes: { [_: $Keys<typeof styles>]: string },
  match: Match
};
type State = {
  bubbleOpened: boolean
};
class ProfileCard extends Component<Props, State> {
  state = {
    bubbleOpened: false
  };

  anchorEl: *;

  onProfileRef = (ref: *) => {
    this.anchorEl = ref;
  };

  onCloseBubble = () => {
    this.setState({ bubbleOpened: false });
  };

  onClickProfileCard = () => {
    this.setState(state => ({
      bubbleOpened: !state.bubbleOpened
    }));
  };

  render() {
    const { match, classes, me } = this.props;
    const { bubbleOpened } = this.state;
    return (
      <div>
        <div
          className={classes.base}
          onClick={this.onClickProfileCard}
          ref={this.onProfileRef}
        >
          <FaUserCircle size={30} />
          <div className={classes.profile_info}>
            <Text className={classes.userName}>{me.username}</Text>
            <Text
              small
              uppercase
              bold
              className={classes.userRole}
              data-test="view-profile"
            >
              {me.role || "Administrator"}
            </Text>
          </div>
        </div>
        <PopBubble
          className="MuiPopover-triangle-left"
          classes={{ paper: classes.popover }}
          anchorEl={this.anchorEl}
          open={bubbleOpened}
          onClose={this.onCloseBubble}
          direction="left"
        >
          <div onClick={this.onCloseBubble}>
            <MenuList>
              <MenuLink
                to={
                  match.params.orga_name && `/${match.params.orga_name}/logout`
                }
                data-test="logout"
              >
                <Text small uppercase bold i18nKey="actionBar:logout" />
              </MenuLink>
            </MenuList>
          </div>
        </PopBubble>
      </div>
    );
  }
}

export default withStyles(styles)(withMe(ProfileCard));
