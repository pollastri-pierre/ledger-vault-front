// @flow

import React, { PureComponent } from "react";
import Animated from "animated/lib/targets/react-dom";
import styled from "styled-components";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

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
          <VaultLayoutMenuHeader isOpened={isOpened} isFloating={isFloating} />
        </Animated.div>
        <VaultLayoutMenuBody>
          <VaultLayoutMenuItemsGroup>
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
          </VaultLayoutMenuItemsGroup>
        </VaultLayoutMenuBody>
      </VaultLayoutMenu>
    );
  }
}

const styles = {
  whiteBackground: {
    background: "white",
    boxShadow: "0 5px 5px 2px rgba(0, 0, 0, 0.07)",
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

const VaultLayoutMenuItemsGroup = styled.div``;

const VaultLayoutMenuToggle = styled.div`
  pointer-events: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
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
  background: rgba(0, 0, 0, 0.03);
  position: relative;
  transition: 250ms linear opacity;
  opacity: ${p => (p.isOpened || !p.isFloating ? 1 : 0)};
`;

const VaultLayoutMenuHeader = ({ isOpened, isFloating }: $Shape<Props>) => (
  <VaultLayoutMenuHeaderComponent isOpened={isOpened} isFloating={isFloating} />
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
