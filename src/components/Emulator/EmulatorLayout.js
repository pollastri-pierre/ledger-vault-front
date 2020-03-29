// @flow

import React, { useState } from "react";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import styled from "styled-components";
import { animated } from "react-spring";
import {
  FaTrash,
  FaMinus,
  FaExpand,
  FaChevronDown,
  FaPlus,
} from "react-icons/fa";

import colors from "shared/colors";
import TranslatedError from "components/TranslatedError";
import Spinner from "components/base/Spinner";
import Box from "components/base/Box";
import useDrag from "hooks/useDrag";
import blueLayer from "./blue-layer.svg";
import blueLayerMinimized from "./blue-layer-minimized.svg";
import { useEmulatorState, useEmulatorDispatch } from "./EmulatorContext";
import SeedsManager from "./SeedsManager";
import SeedsGenerator from "./SeedsGenerator";
import type { Seed } from "./EmulatorContext";

type Props = {
  vncRef: any,
  onClearSession: () => any,
  onSpawnDevice: Seed => any,
};

const EmulatorLayout = (props: Props) => {
  const { vncRef, onClearSession, onSpawnDevice } = props;
  const { isFetching, isMinimized, device, error } = useEmulatorState();

  const [style, dragHandlerRef] = useDrag();

  return (
    <EmulatorLayoutContainer style={style}>
      <TopActions onSpawnDevice={onSpawnDevice} />
      <DeviceWrapper isMinimized={isMinimized}>
        <div ref={dragHandlerRef}>
          {isMinimized ? <DeviceDrawingMinimized /> : <DeviceDrawing />}
        </div>
        <Screen style={{ display: isMinimized ? "none" : undefined }}>
          <VNC ref={vncRef} />
          {error ? (
            <TranslatedError error={error} />
          ) : isFetching ? (
            <Spinner size="big" />
          ) : !device ? (
            <EmptyState />
          ) : null}
        </Screen>
      </DeviceWrapper>
      {!isMinimized && (
        <BottomActions
          onClearSession={onClearSession}
          onSpawnDevice={onSpawnDevice}
        />
      )}
    </EmulatorLayoutContainer>
  );
};

const EmptyState = () => (
  <div style={{ color: "#bbb", fontSize: 16 }}>
    <strong>No device created yet.</strong>
    <div>Feel free to spawn one.</div>
  </div>
);

const EmulatorLayoutContainer = styled(animated.div)`
  pointer-events: none;
  position: fixed;
  z-index: 300;
  // carefully crafted to be page centered
  top: calc(50% - 382px);
  right: 48px;
  width: 460px;
  * {
    user-select: none;
  }
`;

const DeviceWrapper = styled.div`
  pointer-events: auto;
  position: relative;
  box-shadow: ${colors.shadows.material2};
  border-radius: 28px;
  width: 456px;
`;

const Screen = styled.div`
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
  width: 320px;
  height: 480px;
  top: 78px;
  left: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VNC = styled.div`
  position absolute;
  top: 0;
  left: 0;
`;

const DeviceDrawing = styled.img.attrs({
  draggable: false,
  src: blueLayer,
})`
  display: block;
  height: 636px;
  width: 460px;
  cursor: move;
`;

const DeviceDrawingMinimized = () => (
  <DeviceDrawingMinimizedContainer>
    <DeviceDrawingMinimizedImg />
    <span style={{ position: "relative" }}>Personal Security Device</span>
  </DeviceDrawingMinimizedContainer>
);

const DeviceDrawingMinimizedContainer = styled.div`
  width: 456px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
  color: #bbb;
  font-weight: bold;
  * {
    cursor: move;
  }
`;

const DeviceDrawingMinimizedImg = styled(DeviceDrawing).attrs({
  src: blueLayerMinimized,
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 456px;
  height: 100px;
`;

const TopActions = ({ onSpawnDevice }: $Shape<Props>) => {
  const { isMinimized } = useEmulatorState();
  const dispatch = useEmulatorDispatch();
  const handleToggleMinimize = () => dispatch({ type: "TOGGLE_MINIMIZE" });
  return (
    <ActionsContainer>
      <ActionsRight>
        <Action onClick={handleToggleMinimize}>
          {isMinimized ? <FaExpand /> : <FaMinus />}
        </Action>
      </ActionsRight>
      <DeviceSwitcher onSpawnDevice={onSpawnDevice} />
    </ActionsContainer>
  );
};

const BottomActions = (props: $Shape<Props>) => {
  const { onClearSession } = props;
  const { devices } = useEmulatorState();
  return (
    <ActionsContainer>
      {!!devices.length && (
        <ActionsRight>
          <Action isPadded onClick={onClearSession}>
            End session
          </Action>
        </ActionsRight>
      )}
    </ActionsContainer>
  );
};

const MenuButtonPatched = ({ isPadded, ...p }: any) => <MenuButton {...p} />;

const ActionMenuList = styled(MenuList)`
  z-index: 400;
  padding: 0;
  min-width: 150px;
  margin: 8px 0;
  font: inherit;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: ${colors.shadows.material2};
`;

const ActionMenuItem = styled(MenuItem)`
  font: inherit;
  padding: 8px 16px;
  outline: none;
  &[data-selected] {
    background: hsl(0, 0%, 95%);
    color: inherit;
  }
`;

const Chevron = styled(FaChevronDown)`
  transition: 250ms ease-in-out transform;
`;

const ActionsContainer = styled.div`
  height: 64px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ActionsSide = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  > * + * {
    margin-left: 8px;
  }
`;

const ActionsRight = styled(ActionsSide)`
  right: 16px;
`;

const Action = styled(({ isPadded, ...p }) => <div {...p} />)`
  pointer-events: auto;
  min-width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background: hsl(0, 0%, 87%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${p => (p.isPadded ? "0 20px" : "unset")};
  user-select: none;
  font-weight: bold;

  &:hover {
    background: hsl(0, 0%, 90%);
  }

  &:active {
    background: hsl(0, 0%, 85%);
  }

  &:focus {
    outline: none;
  }
`;

const DeviceSwitcher = (props: $Shape<Props>) => {
  const { onSpawnDevice } = props;
  const { device, devices, seeds } = useEmulatorState();
  const dispatch = useEmulatorDispatch();
  const [isSpawning, setSpawning] = useState(false);

  const setDevice = d => dispatch({ type: "SET_DEVICE", payload: d });

  const handleOpenSeedsManager = () => dispatch({ type: "OPEN_SEEDS_MANAGER" });
  const handleClearSeeds = () => dispatch({ type: "CLEAR_SEEDS" });
  const handleOpenSeedsGenerator = () =>
    dispatch({ type: "OPEN_SEEDS_GENERATOR" });

  const handleSpawn = async d => {
    setSpawning(true);
    try {
      await onSpawnDevice(d);
    } catch (err) {
      console.error(err);
    }
    setSpawning(false);
  };

  const inner = isSpawning ? (
    <Action>
      <Spinner />
    </Action>
  ) : (
    <Menu>
      {({ isOpen }) => (
        <>
          {devices.length && device ? (
            <MenuToggle isOpen={isOpen}>{device.name}</MenuToggle>
          ) : (
            <MenuToggle isOpen={isOpen}>Spawn device</MenuToggle>
          )}
          <ActionMenuList>
            {seeds.length > 0 && (
              <ActionMenuItem onSelect={handleClearSeeds}>
                <Box flow={8} align="center" horizontal>
                  <FaTrash />
                  <span style={{ fontWeight: "bold" }}>Clear seeds</span>
                </Box>
              </ActionMenuItem>
            )}
            <ActionMenuItem onSelect={handleOpenSeedsManager}>
              <Box flow={8} align="center" horizontal>
                <FaPlus />
                <span style={{ fontWeight: "bold" }}>Add custom seed</span>
              </Box>
            </ActionMenuItem>
            <ActionMenuItem onSelect={handleOpenSeedsGenerator}>
              <Box flow={8} align="center" horizontal>
                <FaPlus />
                <span style={{ fontWeight: "bold" }}>
                  Generate Workspace seeds
                </span>
              </Box>
            </ActionMenuItem>
            {seeds.map(s => {
              const seedDevice = devices.find(d => d.name === s.name);
              const isActive = !!seedDevice;
              const onSelect = () =>
                seedDevice ? setDevice(seedDevice) : handleSpawn(s);
              return (
                <ActionMenuItem key={s.name} onSelect={onSelect}>
                  <Box horizontal align="center" flow={8}>
                    <Pastille isActive={isActive} />
                    <span>{s.name}</span>
                  </Box>
                </ActionMenuItem>
              );
            })}
          </ActionMenuList>
        </>
      )}
    </Menu>
  );

  return (
    <>
      <SeedsManager onCreate={handleSpawn} />
      <SeedsGenerator />
      {inner}
    </>
  );
};

const Pastille = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => (p.isActive ? "#8FE2B0" : "#ddd")};
`;

const MenuToggle = ({
  isOpen,
  children,
}: {
  isOpen: boolean,
  children: React$Node,
}) => (
  <Action isPadded as={MenuButtonPatched}>
    <Box horizontal align="center" flow={16}>
      <span>{children}</span>
      <Chevron
        style={{
          transform: `rotate(${isOpen ? "-180deg" : "0deg"})`,
        }}
      />
    </Box>
  </Action>
);

export default EmulatorLayout;
