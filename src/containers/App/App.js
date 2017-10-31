//@flow
import React from "react";
import { connect } from "react-redux";
import injectTapEventPlugin from "react-tap-event-plugin";
import "open-sans-fontface/open-sans.css";
import "material-design-icons/iconfont/material-icons.css";
import { logout } from "../../redux/modules/auth";
import { openModalAccount } from "../../redux/modules/account-creation";
import { openModalOperation } from "../../redux/modules/operation-creation";
import { ActionBar, Content, Menu } from "../../components";

import "./App.css";

// Set blur status to root element on dispatch
const mapStateToProps = state => ({
  blurredBG: state.blurBG.blurredBG > 0,
  routing: state.routing
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
  onOpenAccount: () => dispatch(openModalAccount()),
  onOpenOperation: () => dispatch(openModalOperation())
});

// Required by Material-UI
injectTapEventPlugin();

type Props = {
  blurredBG: boolean,
  // TODO the blurredBG will no longer be a store, but part of the Modal component...
  routing: Object,
  onLogout: Function,
  onOpenAccount: Function,
  onOpenOperation: Function
};

function App(props: Props) {
  return (
    <div className={`App ${props.blurredBG ? "blurred" : ""}`}>
      <ActionBar
        logout={props.onLogout}
        openAccount={props.onOpenAccount}
        pathname={props.routing.location.pathname}
      />
      <div className="Main">
        <Menu
          openOperation={props.onOpenOperation}
          pathname={props.routing.location.pathname}
        />
        <Content />
      </div>
    </div>
  );
}

// Soon, App won't need to be connected
export default connect(mapStateToProps, mapDispatchToProps)(App);
