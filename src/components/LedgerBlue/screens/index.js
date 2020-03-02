// @flow

import React from "react";
import styled from "styled-components";
import { FaWrench } from "react-icons/fa";
import { AiOutlineExclamation, AiTwotoneTool } from "react-icons/ai";
import { GoGear } from "react-icons/go";

import Spinner from "components/base/Spinner";
import colors from "shared/colors";
import Box from "components/base/Box";
import { useLedgerBlueUI } from "components/LedgerBlue";
import LineRow from "components/LineRow";

type UpdateScreenProps = {
  Icon: React$ComponentType<*>,
  iconCircle?: boolean,
  title: string,
  description: string,
  actions?: React$Node,
  displayFullText?: boolean,
};

const EmptyTextField = styled.div`
  height: ${p => (p.size === "normal" ? 6 : 3)}px;
  background: ${p => p.color || colors.pearl};
  width: ${p => p.width}px;
  margin: 2px;
`;
const UpdateScreen = ({
  Icon,
  iconCircle,
  title,
  description,
  actions,
  displayFullText,
}: UpdateScreenProps) => {
  const { size } = useLedgerBlueUI();

  return (
    <Container align="center" justify="center" flex={10} height={100}>
      <IconContainer>
        {iconCircle ? (
          <Circle size={size}>
            <Icon size={ICON_SIZE[size]} />
          </Circle>
        ) : (
          <Icon size={ICON_SIZE[size]} />
        )}
      </IconContainer>

      <Title>
        {displayFullText ? title : <EmptyTextField size={size} width={20} />}
      </Title>

      {displayFullText && <Description> {description}</Description>}
      {actions && (
        <ActionButtons size={size} displayFullText={displayFullText} />
      )}
    </Container>
  );
};

// UpdateScreen Styled
const Container = styled(Box)`
  background: ${colors.white};
  height: ${p => p.height}%;
  border-radius: 3px;
`;

const IconContainer = styled.div`
  padding: 10px 0;
`;
const Circle = styled.div`
  padding: 5px;
  border-radius: 50%;
  border: ${p => (p.size === "normal" ? 4 : 2)}px solid ${colors.lead};
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${p => (p.size === "normal" ? 35 : 25)}px;
  height: ${p => (p.size === "normal" ? 35 : 25)}px;
`;
const Title = styled.div`
  font-weight: bold;
  font-size: 1em;
  color: ${colors.black};
`;

const Description = styled.div`
  text-align: center;
  font-size: 1em;
  padding: 0 15px;
`;

type ActionButtonsProps = {
  displayFullText?: boolean,
  size: string,
};
const ActionButtons = ({ displayFullText, size }: ActionButtonsProps) => (
  <ActionButtonsContainer
    horizontal
    size={size}
    align="center"
    justify="center"
    flow={10}
  >
    <Button size={size} background={colors.lead}>
      {displayFullText && "DENY"}
    </Button>
    <Button size={size} background={colors.legacyGreen}>
      {displayFullText && "ALLOW"}
    </Button>
  </ActionButtonsContainer>
);

const ActionButtonsContainer = styled(Box)`
  width: 100%;
  padding-top: ${p => (p.size === "normal" ? 10 : 15)}px;
`;

const Button = styled.div`
  height: ${p => (p.size === "normal" ? 20 : 10)}px;
  width: ${p => (p.size === "normal" ? 100 : 30)}px;
  color: ${colors.white};
  background: ${p => p.background};
  border-radius: 10px;
  text-align: center;
  font-size: 0.7m;
`;
type DashBoardScreenProps = {
  displayFullText?: boolean,
  Icon: React$ComponentType<*>,
};
const DashBoardScreen = ({ displayFullText, Icon }: DashBoardScreenProps) => {
  const { size } = useLedgerBlueUI();
  return (
    <DashBoardContainer>
      <Header size={size}>
        <div>
          {displayFullText ? (
            "DASHBOARD"
          ) : (
            <EmptyTextField
              size={size}
              width={size === "normal" ? 60 : 30}
              color={colors.white}
            />
          )}
        </div>
      </Header>
      <DashboardContent>
        <AppIcon size={size}>
          <Icon size={ICON_SIZE[size]} />
        </AppIcon>
      </DashboardContent>
    </DashBoardContainer>
  );
};

const DashBoardContainer = styled.div`
  background: ${colors.white};
  height: 100%;
  border-radius: 5px;
`;

const DashboardContent = styled.div`
  background: ${colors.white};
`;

const Header = styled.div`
  height: ${p => (p.size === "normal" ? 50 : 20)}px;
  background: ${colors.black};
  color: ${colors.white};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    font-size: ${p => (p.size === "normal" ? 1 : 0.5)}em;
    font-weight: bold;
  }
`;

const AppIconContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.black};
  font-weight: bold;
`;

const AppIcon = styled.div(
  p => `
  margin: ${p.size === "normal" ? 20 : 10}px;
  border-radius: 5px;
  width: ${p.size === "normal" ? 45 : 20}px;
  background: ${colors.shark};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${p.size === "normal" ? 10 : 5}px;
`,
);

const UpdateFirmWareScreen = ({
  displayFullText,
  Icon,
}: DashBoardScreenProps) => {
  const { size } = useLedgerBlueUI();
  return (
    <DashBoardContainer>
      <Header size={size}>
        <div>
          {displayFullText ? (
            "UPDATE FIRMWARE"
          ) : (
            <EmptyTextField
              size={size}
              width={size === "normal" ? 60 : 30}
              color={colors.white}
            />
          )}
        </div>
      </Header>
      <DashboardContent>
        <AppIconContainer>
          <AppIcon size={size}>
            <Icon size={ICON_SIZE[size]} />
          </AppIcon>
          <IconInfo>
            {displayFullText ? (
              "App info"
            ) : (
              <EmptyTextField size={size} width={size === "normal" ? 50 : 25} />
            )}{" "}
          </IconInfo>
        </AppIconContainer>

        <UpdateFirmWareDetailsContainer size={size}>
          <Box>
            <LineRow
              label={
                displayFullText ? (
                  "IDENTIFIER"
                ) : (
                  <EmptyTextField
                    size={size}
                    width={size === "normal" ? 20 : 10}
                  />
                )
              }
            >
              {displayFullText ? (
                "ABC_1234"
              ) : (
                <EmptyTextField
                  size={size}
                  width={size === "normal" ? 20 : 10}
                />
              )}
            </LineRow>
            <LineRow
              label={
                displayFullText ? (
                  "ISSUER"
                ) : (
                  <EmptyTextField
                    size={size}
                    width={size === "normal" ? 20 : 10}
                  />
                )
              }
            >
              {displayFullText ? (
                "Ledger"
              ) : (
                <EmptyTextField
                  size={size}
                  width={size === "normal" ? 20 : 10}
                />
              )}
            </LineRow>
          </Box>
        </UpdateFirmWareDetailsContainer>

        <ActionButtons displayFullText={displayFullText} size={size} />
      </DashboardContent>
    </DashBoardContainer>
  );
};

const UpdateFirmWareDetailsContainer = styled.div`
  padding: 0 ${p => (p.size === "normal" ? 20 : 10)}px;
  height: ${p => (p.size === "normal" ? 270 : 40)}px;
  div {
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;

const IconInfo = styled.div`
  color: ${colors.black}
  position: absolute;
`;
type ScreenProps = { displayFullText?: boolean };

const ICON_SIZE = {
  small: 12,
  normal: 24,
};

export const LedgerManager = ({ displayFullText }: ScreenProps) => (
  <UpdateScreen
    title={"Ledger Manager"}
    Icon={FaWrench}
    actions
    iconCircle
    displayFullText={displayFullText}
    description={
      "Allow Ledger app to manager your applications and device settings ?"
    }
  />
);

export const OsUpdater = ({ displayFullText }: ScreenProps) => (
  <UpdateScreen
    title={"OS UPDATER"}
    Icon={AiOutlineExclamation}
    iconCircle
    displayFullText={displayFullText}
    description={
      "Please open the Ledger Manager app to proceed with the update of the device."
    }
  />
);
export const AllowManager = ({ displayFullText }: ScreenProps) => (
  <UpdateScreen
    iconCircle
    Icon={AiTwotoneTool}
    title="ALLOW MANAGER"
    description="Allow Ledger app to manage your applications and device settings"
    actions
    displayFullText={displayFullText}
  />
);

const SpinnerIcon = () => <Spinner color={colors.legacyDarkGrey1} />;
export const Processing = ({ displayFullText }: ScreenProps) => (
  <UpdateScreen
    title={"Processing..."}
    Icon={SpinnerIcon}
    displayFullText={displayFullText}
    description={"Please wait, this operation may take a few moments."}
  />
);

export const DashBoard = ({ displayFullText }: ScreenProps) => (
  <DashBoardScreen Icon={GoGear} displayFullText={displayFullText} />
);
export const UpdateFirmware = ({ displayFullText }: ScreenProps) => (
  <UpdateFirmWareScreen Icon={GoGear} displayFullText={displayFullText} />
);
