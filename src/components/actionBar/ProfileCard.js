//@flow
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import type { Member } from "../../data/types";
import ProfileEditModal from "../ProfileEditModal";
import ModalRoute from "../ModalRoute";
import PopBubble from "../utils/PopBubble";
import ProfileIcon from "../icons/thin/Profile";
import CircularProgress from "material-ui/Progress/CircularProgress";
import connectData from "../../restlay/connectData";
import { withStyles } from "material-ui/styles";
import { mixinHoverSelected } from "../../shared/common";
import ProfileQuery from "../../api/queries/ProfileQuery";
import { MenuList } from "material-ui/Menu";
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
    location: *
  },
  *
> {
  state = {
    bubbleOpened: false
  };

  // FIXME translate should be a component so i don't have to depend on context
  static contextTypes = {
    translate: PropTypes.func.isRequired
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
    const { profile, location, classes } = this.props;
    const { bubbleOpened } = this.state;
    const t = this.context.translate;
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
              {t("actionBar.viewProfile")}
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
              <MenuLink to={location.pathname + "/profile-edit"}>
                <span className={classes.link}>
                  {t("actionBar.editProfile")}
                </span>
              </MenuLink>
              <MenuLink to="/logout">
                <span className={classes.link}>{t("actionBar.logOut")}</span>
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

export default withRouter(
  connectData(withStyles(styles)(ProfileCard), {
    RenderLoading,
    queries: {
      profile: ProfileQuery
    }
  })
);
