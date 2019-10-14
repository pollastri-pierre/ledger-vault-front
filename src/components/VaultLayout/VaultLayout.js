// @flow

import React, { Component } from "react";
import type { Match } from "react-router-dom";
import Animated from "animated/lib/targets/react-dom";
import styled from "styled-components";
import colors from "shared/colors";

import type { User } from "data/types";
import { vaultLayoutConfig } from "styles/theme";

import {
  VaultLayoutTopBar,
  VaultLayoutMenu,
  VaultLayoutMainView,
} from "./index";

import type { MenuItem } from "./types";

type Props = {
  children: React$ComponentType<*>,
  menuItems: MenuItem[],
  user: User,
  onLogout: () => void,
  match: Match,
  TopBarContent: React$ComponentType<*>,
};

type State = {
  isMenuOpened: boolean,
  isMenuFloating: boolean,
  globalAnimation: Animated.Value,
};

class VaultLayout extends Component<Props, State> {
  state = {
    isMenuOpened: false,
    isMenuFloating: false,
    globalAnimation: new Animated.Value(0),
  };

  componentDidMount() {
    this.animateBreakpoint(window.innerWidth, true);

    const onResize = () => {
      window.requestIdleCallback(() => {
        if (this._isUnmounted) return;
        this.animateBreakpoint(window.innerWidth);
      });
    };

    window.addEventListener("resize", onResize);
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  _isUnmounted = false;

  animateBreakpoint = (width: number, initial: boolean = false) => {
    const {
      globalAnimation,
      isMenuFloating: wasMenuFloating,
      isMenuOpened: wasMenuOpened,
    } = this.state;

    const isMenuFloating = width <= vaultLayoutConfig.BREAKPOINT;

    if (isMenuFloating !== wasMenuFloating) {
      const isMenuOpened = isMenuFloating ? wasMenuOpened : false;
      this.setState({
        isMenuFloating,
        isMenuOpened: isMenuFloating ? isMenuOpened : false,
      });
      if (initial) {
        globalAnimation.setValue(isMenuFloating ? 1 : 0);
      } else {
        const toValue = isMenuFloating ? (isMenuOpened ? 2 : 1) : 0;
        if (wasMenuFloating && wasMenuOpened && !isMenuFloating) {
          globalAnimation.setValue(toValue);
        } else {
          Animated.spring(globalAnimation, {
            toValue,
            friction: !wasMenuFloating && isMenuFloating ? 8 : undefined,
          }).start();
        }
      }
    }
  };

  toggleMenu = () => {
    const { globalAnimation, isMenuOpened } = this.state;
    this.setState(({ isMenuOpened }) => ({ isMenuOpened: !isMenuOpened }));
    Animated.spring(globalAnimation, {
      toValue: isMenuOpened ? 1 : 2,
      friction: 10,
    }).start();
  };

  render() {
    const {
      children,
      menuItems,
      user,
      onLogout,
      match,
      TopBarContent,
    } = this.props;
    const { isMenuOpened, isMenuFloating, globalAnimation } = this.state;

    return (
      <VaultLayoutFixedContainer className="App">
        <VaultLayoutMenu
          items={menuItems}
          isOpened={isMenuOpened}
          isFloating={isMenuFloating}
          onToggle={this.toggleMenu}
          globalAnimation={globalAnimation}
        >
          menu
        </VaultLayoutMenu>
        <VaultLayoutTopBar
          match={match}
          user={user}
          onLogout={onLogout}
          globalAnimation={globalAnimation}
          TopBarContent={TopBarContent}
        />
        <VaultLayoutMainView isMenuOpened={isMenuOpened}>
          {children}
        </VaultLayoutMainView>
      </VaultLayoutFixedContainer>
    );
  }
}

const VaultLayoutFixedContainer = styled.div`
  // ensure NOTHING will leak horizontally, ever.
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: -1;

  display: flex;
  flex-direction: column;
  background-color: ${colors.form.bg};
  pointer-events: auto;
`;

export default VaultLayout;
