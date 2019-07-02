// @flow

import React from "react";
import styled from "styled-components";
import { FaWrench } from "react-icons/fa";

import { RestlayTryAgain } from "components/TryAgain";
import connectData from "restlay/connectData";
import Spinner from "components/base/Spinner";
import Absolute from "components/base/Absolute";
import colors from "shared/colors";
import Text from "components/base/Text";

type WidgetSettingsProps = {};

type Props = {
  title: React$Node,
  desc?: React$Node,
  children: React$Node,
  SettingsComponent?: React$ComponentType<WidgetSettingsProps>,
  height?: number,
};

export default function Widget(props: Props) {
  const { title, desc, children, SettingsComponent, height } = props;
  const haveSettings = !!SettingsComponent;
  return (
    <WidgetContainer isInteractive={haveSettings} height={height}>
      <WidgetHeader>
        <div>
          <Text inline bold mr={5}>
            {title}
          </Text>
          {desc && (
            <Text inline color={colors.textLight}>
              {desc}
            </Text>
          )}
        </div>
        {haveSettings && (
          <Absolute top={-5} right={-5}>
            <SettingsButton>
              <FaWrench />
            </SettingsButton>
          </Absolute>
        )}
      </WidgetHeader>
      {children}
    </WidgetContainer>
  );
}

export function WidgetLoading({ height }: { height: number }) {
  return (
    <WidgetLoadingContainer height={height}>
      <Spinner />
    </WidgetLoadingContainer>
  );
}

const WidgetLoadingContainer = styled.div`
  height: ${p => p.height}px;
  background: ${colors.form.bg};
  border: 1px dashed ${colors.form.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SettingsButton = styled.div.attrs({
  tabIndex: 0,
})`
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textLight};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${colors.text};
  }
  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const WidgetContainer = styled.div`
  position: relative;
  height: ${p => (p.height ? `${p.height}px` : "auto")};
  display: flex;
  flex-direction: column;

  // prevent jump after WidgetLoading disappear
  border: 1px solid transparent;

  ${SettingsButton} {
    opacity: 0;
    pointer-events: none;
  }

  > * + * {
    margin-top: 10px;
  }

  ${p => (p.isInteractive ? widgetContainerHover : "")};
`;

const widgetContainerHover = `
  &:hover {
    ${SettingsButton} {
      opacity: 1;
      pointer-events: auto;
    }
    &:before {
      position: absolute;
      content: "";
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      pointer-events: none;
    }
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-right: 40px;
`;

export function connectWidget(
  WidgetComponent: React$ComponentType<*>,
  options: Object,
) {
  const { height, ...opts } = options;
  return connectData(WidgetComponent, {
    ...opts,
    RenderLoading: () => <WidgetLoading height={height} />,
    RenderError: RestlayTryAgain,
  });
}
