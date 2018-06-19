//@flow
import React, { Component } from "react";
import { translate } from "react-i18next";
import type { Translate } from "data/types";
import type { Member } from "data/types";
import ProfileEditModal from "../ProfileEditModal";
import ModalRoute from "../ModalRoute";
import PopBubble from "../utils/PopBubble";
import ProfileIcon from "../icons/thin/Profile";
import CircularProgress from "@material-ui/core/CircularProgress";
import connectData from "restlay/connectData";
import { withStyles } from "@material-ui/core/styles";
import { mixinHoverSelected } from "shared/common";
import ProfileQuery from "api/queries/ProfileQuery";
import MenuList from "@material-ui/core/MenuList";
import MenuLink from "../MenuLink";

const styles = {
  base: {
    ...mixinHoverSelected("white", "0px"),
    cursor: "pointer",
    textDecoration: "none",
    height: "30px",
    width: "280px",
    paddingLeft: "40px",
    marginBottom: "49px",
    position: "absolute",
    bottom: "0",
    opacity: "1"
  },
  circle: {
    width: "30px",
    textAlign: "center",
    boxSizing: "border-box",
    paddingTop: "5px",
    height: "30px",
    float: "left",
    background: "#eee",
    borderRadius: "50%"
  },
  profile_info: {
    position: "relative",
    height: "100%",
    marginLeft: "30px",
    paddingLeft: "20px"
  },
  profile_name: {
    fontSize: "13px",
    textTransform: "capitalize",
    lineHeight: "1em"
  },
  profile_view_profile: {
    fontSize: "11px",
    textTransform: "uppercase",
    opacity: ".5",
    fontWeight: "600",
    position: "absolute",
    bottom: "0",
    lineHeight: "1em",
    transition: "opacity .2s ease"
  },
  link: {
    color: "black",
    textTransform: "uppercase"
  },
  popover: {
    paddingLeft: 0
  }
};

class ProfileCard extends Component<
  {
    profile: Member,
    history: *,
    t: Translate,
    classes: { [_: $Keys<typeof styles>]: string },
    location: *,
    match: *
  },
  *
> {
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

  onClickProfileCard = (/* event: * */) => {
    this.setState({
      bubbleOpened: !this.state.bubbleOpened
    });
  };

  render() {
    const { profile, match, classes, t } = this.props;
    console.log(match);
    const { bubbleOpened } = this.state;
    return (
      <span>
        <span
          className={classes.base}
          onClick={this.onClickProfileCard}
          ref={this.onProfileRef}
        >
          <div className={classes.circle}>
            {profile.picture ? (
              <img src={profile.picture} alt="" />
            ) : (
              <ProfileIcon />
            )}
          </div>
          <div className={classes.profile_info}>
            <div className={classes.profile_name}>
              {profile.first_name} {profile.last_name}
            </div>
            <div className={classes.profile_view_profile}>
              {t("actionBar:view_profile")}
            </div>
          </div>
        </span>

        <PopBubble
          className="MuiPopover-triangle-left"
          classes={{ paper: classes.popover }}
          style={{ marginLeft: "50px" }}
          anchorEl={this.anchorEl}
          open={bubbleOpened}
          onClose={this.onCloseBubble}
          direction="left"
        >
          <div onClick={this.onCloseBubble}>
            <MenuList>
              <MenuLink to={`/${match.params.orga_name}/logout`}>
                <span className={classes.link}>{t("actionBar:logout")}</span>
              </MenuLink>
            </MenuList>
          </div>
        </PopBubble>

        <ModalRoute path="*/profile-edit" component={ProfileEditModal} />
      </span>
    );
  }
}

const RenderLoading = withStyles(styles)(({ classes }) => (
  <div className={classes.base}>
    <CircularProgress />
  </div>
));

export default connectData(withStyles(styles)(translate()(ProfileCard)), {
  RenderLoading,
  queries: {
    profile: ProfileQuery
  }
});
