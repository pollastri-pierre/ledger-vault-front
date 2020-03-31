// @flow

import React, { useReducer, useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { FaArrowRight } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";

import colors from "shared/colors";
import { NoWorkspaceForDevice } from "utils/errors";
import Spinner from "components/base/Spinner";
import VaultLogo from "components/icons/Logo";
import Button from "components/base/Button";
import TranslatedError from "components/TranslatedError";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import TransportChooser from "components/TransportChooser";
import Bubble from "components/base/Bubble";
import Absolute from "components/base/Absolute";
import CenteredLayout from "components/base/CenteredLayout";
import { loginFlow } from "device/interactions/loginFlow";
import { getU2FPublicKey } from "device/interactions/common";
import DeviceInteraction from "components/DeviceInteraction";
import imgBlue from "assets/img/blue.svg";

const getDeviceID = [getU2FPublicKey];

async function fetchWorkspaces(pubKey) {
  const raw = await fetch(
    `${window.config.DEVICE_REGISTRY_BASE_URL}/device?pub_key=${pubKey}`,
  );
  return raw.json();
}

// used by devtools to automatically login
const mapAutoLogin = state => ({
  autoLogin: state.auth && state.auth.autoLogin === true,
});

type Status = "IDLE" | "ERROR" | "CHOOSE_WORKSPACE";

type State = {|
  status: Status,
  workspaces: string[],
  workspace: string | null,
  error: Error | null,
|};

const INITIAL_STATE: State = {
  status: "IDLE",
  workspace: null,
  workspaces: [],
  error: null,
};

const reducer = (state, action) => {
  let workspaces;
  let error;
  switch (action.type) {
    case "CHOOSE_WORKSPACE":
      workspaces = action.payload;
      return { ...state, status: "CHOOSE_WORKSPACE", workspaces };
    case "ERROR":
      error = action.payload;
      return { ...state, status: "ERROR", error };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};

const Login = () => {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { workspaces, error } = state;

  const loginToWorkspace = workspace => history.push(`/${workspace}/login`);

  const handleError = (err: Error) => {
    dispatch({ type: "ERROR", payload: err });
  };

  const handleStartLogin = async deviceID => {
    try {
      const workspaces = await fetchWorkspaces(deviceID);
      if (!workspaces.length) {
        throw new NoWorkspaceForDevice();
      }
      if (workspaces.length === 1) {
        return loginToWorkspace(workspaces[0]);
      }
      dispatch({ type: "CHOOSE_WORKSPACE", payload: workspaces });
    } catch (err) {
      handleError(err);
    }
  };

  const handleSelectWorkspace = workspace => loginToWorkspace(workspace);
  const handleReset = () => dispatch({ type: "RESET" });

  return (
    <LoginContainer>
      {state.status === "IDLE" && (
        <Welcome onDeviceID={handleStartLogin} onError={handleError} />
      )}
      {state.status === "CHOOSE_WORKSPACE" && (
        <WorkspaceChooser
          workspaces={workspaces}
          onSelect={handleSelectWorkspace}
        />
      )}
      {state.status === "ERROR" && error && (
        <DisplayError error={error} onReset={handleReset} />
      )}
    </LoginContainer>
  );
};

export const LoginLoading = () => (
  <LoginContainer>
    <Box align="center" justify="center" height={400}>
      <Spinner />
    </Box>
  </LoginContainer>
);

export const LoginDevice = () => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const {
    params: { workspace },
  } = useRouteMatch();
  if (!workspace) return null;
  const handleReset = () => history.push("/");
  const handleError = err => setError(err);
  const handleSuccess = async () => {
    const redirect = `/${workspace}`;
    if (process.env.NODE_ENV === "production") {
      window.location.href = redirect;
    } else {
      history.push(redirect);
    }
  };
  return (
    <LoginContainer>
      {error ? (
        <DisplayError error={error} onReset={handleReset} />
      ) : (
        <LoginIn
          workspace={workspace}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </LoginContainer>
  );
};

type DisplayErrorProps = {
  error: Error,
  onReset: () => any,
};

const DisplayError = ({ error, onReset }: DisplayErrorProps) => (
  <Box justify="center" align="center" flow={20} height={400}>
    <InfoBox type="error">
      <b>
        <TranslatedError error={error} />
      </b>
      <TranslatedError error={error} field="description" />
    </InfoBox>
    <Button type="filled" onClick={onReset}>
      <Text i18nKey="common:back" />
    </Button>
  </Box>
);

type LoginInProps = {
  workspace: string,
  onSuccess: () => any,
  onError: Error => any,
};

const LoginIn = ({ workspace, onSuccess, onError }: LoginInProps) => (
  <Box height={400} align="center" justify="center" flow={20}>
    <Box style={{ fontSize: 18, lineHeight: "24px" }}>
      <span>
        Login into <b>{workspace}</b>...
      </span>
    </Box>
    <DeviceInteraction
      interactions={loginFlow}
      onError={onError}
      onSuccess={onSuccess}
      additionalFields={{ organization: { workspace } }}
    />
  </Box>
);

type WorkspaceProps = {
  workspace: string,
  onClick: () => void,
};

const Workspace = ({ workspace, onClick }: WorkspaceProps) => (
  <WorkspaceContainer onClick={onClick}>
    <WorkspaceIdentifier>{workspace[0]}</WorkspaceIdentifier>
    <WorkspaceName>{workspace}</WorkspaceName>
  </WorkspaceContainer>
);

const WorkspaceIdentifier = styled.div`
  width: 60px;
  height: 60px;
  background: white;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  text-transform: uppercase;
  border-radius: 8px;
  margin-right: 20px;
`;

const WorkspaceContainer = styled.div`
  font-size: 18px;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  user-select: none;
  transition: 60ms linear background;
  &:hover {
    background: rgba(0, 0, 0, 0.07);
    cursor: pointer;
  }
  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const WorkspaceName = styled.div`
  flex-grow: 1;
`;

type WorkspaceChooserProps = {
  workspaces: string[],
  onSelect: string => void,
};

const WorkspaceChooser = ({ workspaces, onSelect }: WorkspaceChooserProps) => {
  return (
    <Box flow={20}>
      <Box style={{ fontSize: 18, lineHeight: "24px" }}>
        Select a workspace to connect to:
      </Box>
      <Box flow={10}>
        {workspaces.map(workspace => (
          <Workspace
            key={workspace}
            workspace={workspace}
            onClick={() => onSelect(workspace)}
          />
        ))}
      </Box>
    </Box>
  );
};

export const LoginContainer = ({ children }: { children: React$Node }) => (
  <CenteredLayout>
    <Box p={60} borderRadius={10} style={styles.bg}>
      <Box align="center" mb={30}>
        <VaultLogo width={250} />
      </Box>
      <Box width={500} height={400}>
        {children}
      </Box>
    </Box>
    <Box mt={40}>
      <Text size="small">Ledger Vault - v{VAULT_FRONT_VERSION}</Text>
    </Box>
  </CenteredLayout>
);

type WelcomeProps = {|
  onDeviceID: string => any,
  onError: Error => any,
|};

type ConnectedWelcomeProps = WelcomeProps & { autoLogin: boolean };

const Welcome: React$ComponentType<WelcomeProps> = connect(mapAutoLogin)(
  ({ onDeviceID, onError, autoLogin }: ConnectedWelcomeProps) => {
    const [requestingDeviceID, setRequestingDeviceID] = useState(false);

    const btnRef = useRef(null);
    useEffect(() => {
      if (autoLogin) {
        btnRef.current && btnRef.current.click();
      }
    }, [autoLogin]);

    const handleClick = () => setRequestingDeviceID(true);

    return (
      <Box align="center">
        <Box
          width={400}
          style={{ textAlign: "center", fontSize: 18, lineHeight: "24px" }}
        >
          <span>
            Please <b>connect</b> the Ledger Blue Enterprise to your computer,
            and <b>switch it on</b>.
          </span>
        </Box>
        <Box noShrink position="relative" mt={30} mb={30}>
          <img src={imgBlue} alt="Blue" height={250} />
          <Absolute top={45} right={-40}>
            <Bubble />
          </Absolute>
          <Screen>
            <Box flow={15} p={20} pt={30}>
              <Box align="center">
                <AiOutlineUser size={40} color="rgba(0, 0, 0, 0.15)" />
              </Box>
              <FakeLine />
              <FakeLine />
              <FakeLine />
            </Box>
          </Screen>
        </Box>
        <Box flow={10} align="center">
          {requestingDeviceID ? (
            <DeviceInteraction
              noCheckVersion
              interactions={getDeviceID}
              onError={onError}
              onSuccess={({ u2f_key }) => onDeviceID(u2f_key.pubKey)}
            />
          ) : (
            <>
              <Button
                style={{ width: 150 }}
                type="filled"
                onClick={handleClick}
                data-test="loginbutton"
                // $FlowFixMe no idea why this ref is considered invalid
                ref={btnRef}
              >
                <Box flow={10} horizontal align="center">
                  <span>Sign in</span>
                  <FaArrowRight />
                </Box>
              </Button>
              <TransportChooser />
            </>
          )}
        </Box>
      </Box>
    );
  },
);

const Screen = styled.div`
  background: white;
  box-shadow: inset rgba(0, 0, 0, 0.5) 0 0 5px 0;
  position: absolute;
  top: 38px;
  left: 34px;
  right: 36px;
  bottom: 36px;
  border-radius: 3px;
`;

const FakeLine = styled.div`
  background: rgba(0, 0, 0, 0.15);
  height: 5px;
  width: 100%;
`;

const styles = {
  bg: {
    background: "white",
    boxShadow: colors.shadows.material3,
  },
};

export default Login;
