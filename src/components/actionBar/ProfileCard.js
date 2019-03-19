// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import MenuList from "@material-ui/core/MenuList";
import { FaUserCircle } from "react-icons/fa";

import connectData from "restlay/connectData";
import ProfileQuery from "api/queries/ProfileQuery";

import { mixinHoverSelected } from "shared/common";
import colors from "shared/colors";

import type { Member } from "data/types";

import Text from "components/Text";
import MenuLink from "components/MenuLink";
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
  profile: Member,
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
    const { profile, match, classes } = this.props;
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
            <Text className={classes.userName}>{profile.username}</Text>
            <Text
              small
              uppercase
              bold
              className={classes.userRole}
              data-test="view-profile"
            >
              {profile.role || "Administrator"}
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
                <Text small uppercase bold>
                  <Trans i18nKey="actionBar:logout" />
                </Text>
              </MenuLink>
            </MenuList>
          </div>
        </PopBubble>
      </div>
    );
  }
}

const RenderLoading = withStyles(styles)(({ classes }) => (
  <div className={classes.base}>
    <CircularProgress />
  </div>
));

export default connectData(withStyles(styles)(ProfileCard), {
  RenderLoading,
  queries: {
    profile: ProfileQuery
  }
});
