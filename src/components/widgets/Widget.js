// @flow

import React from "react";
import styled from "styled-components";
import { FaWrench } from "react-icons/fa";

import { RestlayTryAgain } from "components/TryAgain";
import connectData from "restlay/connectData";
import Spinner from "components/base/Spinner";
import Absolute from "components/base/Absolute";
import colors, { darken } from "shared/colors";
import Text from "components/base/Text";

type WidgetSettingsProps = {};

type Props = {
  title?: React$Node,
  titleRight?: React$Node,
  desc?: React$Node,
  children: React$Node,
  SettingsComponent?: React$ComponentType<WidgetSettingsProps>,
  height?: number,
  width?: number,
  style?: Object,
};

export default function Widget(props: Props) {
  const {
    title,
    desc,
    children,
    SettingsComponent,
    titleRight,
    height,
    width,
    style,
  } = props;
  const isInteractive = !!SettingsComponent;
  return (
    <WidgetContainer
      isInteractive={isInteractive}
      height={height}
      width={width}
      style={style}
    >
      {(title || desc || titleRight) && (
        <WidgetHeader
          title={title}
          titleRight={titleRight}
          desc={desc}
          SettingsComponent={SettingsComponent}
        />
      )}
      {children}
    </WidgetContainer>
  );
}

export function WidgetLoading({
  height,
  width,
}: {
  height?: number,
  width?: number,
}) {
  return (
    <WidgetLoadingContainer height={height} width={width}>
      <Spinner />
    </WidgetLoadingContainer>
  );
}

const WidgetLoadingContainer = styled.div`
  height: ${p => (p.height ? `${p.height}px` : "auto")};
  width: ${p => (p.width ? `${p.width}px` : "auto")};
  background: ${darken(colors.form.bg, 0.02)};
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
  width: ${p => (p.width ? `${p.width}px` : "auto")};
  flex-shrink: 0;
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

const WidgetHeader = ({
  title,
  titleRight,
  desc,
  SettingsComponent,
}: {
  title?: React$Node,
  titleRight?: React$Node,
  desc?: React$Node,
  SettingsComponent?: React$ComponentType<*>,
}) => {
  return (
    <StyledWidgetHeader>
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
      <div>{titleRight}</div>
      {!!SettingsComponent && (
        <Absolute top={-5} right={-5}>
          <SettingsButton>
            <FaWrench />
          </SettingsButton>
        </Absolute>
      )}
    </StyledWidgetHeader>
  );
};

const StyledWidgetHeader = styled.div`
  min-height: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export function connectWidget(
  WidgetComponent: React$ComponentType<*>,
  options: Object,
) {
  const { height, width, ...opts } = options;
  return connectData(WidgetComponent, {
    ...opts,
    RenderLoading: () => <WidgetLoading height={height} width={width} />,
    RenderError: RestlayTryAgain,
  });
}
