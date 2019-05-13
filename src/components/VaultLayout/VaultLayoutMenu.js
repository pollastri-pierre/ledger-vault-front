// @flow

import React, { PureComponent } from "react";
import Animated from "animated/lib/targets/react-dom";
import styled from "styled-components";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import colors from "shared/colors";
import VaultLogo from "components/icons/Logo";
import { vaultLayoutConfig } from "styles/theme";
import { VaultLayoutMenuItem } from "./index";
import type { MenuItem } from "./types";

type Props = {
  items: MenuItem[],
  isOpened: boolean,
  isFloating: boolean,
  onToggle: () => void,
  globalAnimation: Animated.Value,
};

const arrowLeft = <FaArrowLeft />;
const arrowRight = <FaArrowRight />;

class VaultLayoutMenuComponent extends PureComponent<Props> {
  render() {
    const {
      isOpened,
      isFloating,
      onToggle,
      globalAnimation,
      items,
    } = this.props;
    const whiteBackgroundStyle = getBgStyle(globalAnimation);
    const toggleArrowStyle = getArrowStyle(globalAnimation);
    const headerStyle = getHeaderStyle(globalAnimation);
    const arrowIcon = isOpened ? arrowLeft : arrowRight;

    return (
      <VaultLayoutMenu>
        <Animated.div style={whiteBackgroundStyle} />

        <Animated.div style={toggleArrowStyle}>
          <VaultLayoutMenuToggle onClick={onToggle}>
            {arrowIcon}
          </VaultLayoutMenuToggle>
        </Animated.div>

        <Animated.div style={headerStyle}>
          <VaultLayoutMenuHeader isOpened={isOpened} isFloating={isFloating}>
            <VaultLogo width={100} />
          </VaultLayoutMenuHeader>
        </Animated.div>
        <VaultLayoutMenuBody>
          <div>
            {items.map(item => (
              <VaultLayoutMenuItem
                key={item.key}
                item={item}
                globalAnimation={globalAnimation}
                isMenuOpened={isOpened}
                isMenuFloating={isFloating}
              >
                {item.label}
              </VaultLayoutMenuItem>
            ))}
          </div>
        </VaultLayoutMenuBody>
      </VaultLayoutMenu>
    );
  }
}

const styles = {
  whiteBackground: {
    pointerEvents: "none",
    background: "white",
    boxShadow: "-3px 2px 5px 0 rgba(0, 0, 0, 0.2)",
    borderRight: "1px solid #f0f0f0",
    position: "fixed",
    top: 0,
    left: -20,
    width: vaultLayoutConfig.MENU_WIDTH + 20,
    bottom: 0,
  },
  toggleArrow: {
    zIndex: 1,
    position: "absolute",
    top: 10,
  },
};

const VaultLayoutMenu = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  bottom: 0;
  user-select: none;
  pointer-events: none;
`;

const VaultLayoutMenuBody = styled.div`
  position: relative;
  padding: 20px 0;

  > * + * {
    margin-top: 20px;
  }
`;

const VaultLayoutMenuToggle = styled.div`
  pointer-events: auto;
  border: 1px solid ${colors.form.border};
  width: 100px;
  height: 40px;
  border-radius: 40px;
  background: white;
  cursor: pointer;
  padding-right: 15px;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const VaultLayoutMenuHeaderComponent = styled.div`
  height: ${vaultLayoutConfig.TOP_BAR_HEIGHT}px;
  width: ${vaultLayoutConfig.MENU_WIDTH + 20}px;
  margin-left: -20px;
  padding-left: 20px;
  padding-top: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 250ms linear opacity;
  opacity: ${p => (p.isOpened || !p.isFloating ? 1 : 0)};
`;

const VaultLayoutMenuHeader = ({
  isOpened,
  isFloating,
  children,
}: {
  isOpened: boolean,
  isFloating: boolean,
  children: React$Node,
}) => (
  <VaultLayoutMenuHeaderComponent isOpened={isOpened} isFloating={isFloating}>
    {children}
  </VaultLayoutMenuHeaderComponent>
);

function getBgStyle(globalAnimation) {
  return {
    ...styles.whiteBackground,
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [
            0,
            -vaultLayoutConfig.MENU_WIDTH +
              vaultLayoutConfig.COLLAPSED_MENU_WIDTH,
            0,
          ],
        }),
      },
    ],
  };
}

function getArrowStyle(globalAnimation) {
  return {
    ...styles.toggleArrow,
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [-100, -60, -50],
        }),
      },
    ],
  };
}

function getHeaderStyle(globalAnimation) {
  return {
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [
            0,
            -vaultLayoutConfig.MENU_WIDTH +
              vaultLayoutConfig.COLLAPSED_MENU_WIDTH,
            0,
          ],
        }),
      },
    ],
  };
}

export default VaultLayoutMenuComponent;
