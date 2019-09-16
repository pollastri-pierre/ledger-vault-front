// @flow

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import network from "network";
import { login } from "redux/modules/auth";
import { loginFlow } from "device/interactions/loginFlow";

import { UnknownDomain } from "utils/errors";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import Spinner from "components/base/Spinner";
import DeviceInteraction from "components/DeviceInteraction";
import VaultCentered from "components/VaultCentered";
import Card from "components/base/Card";
import Button from "components/legacy/Button";
import { MIGRATION_REDIRECTION } from "containers/Welcome";

type Props = {
  match: Match,
  history: MemoryHistory,
};

export default function Login(props: Props) {
  const { match, history } = props;

  const domain = getDomainFromPath(match.path);
  const dispatch = useDispatch();
  const [onboardingToBeDone, setOnboardingToBeDone] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub = false;
    const effect = async () => {
      try {
        const { state } = await network(`/onboarding/state`, "GET");
        if (unsub) return;
        setOnboardingToBeDone(state !== "COMPLETE");
      } catch (e) {
        setError(new UnknownDomain());
      }
    };
    effect();
    return () => {
      unsub = true;
    };
  }, [domain]);

  const onSuccess = res => {
    dispatch(login(res.u2f_challenge.token));
    history.push(`/${domain}`);
  };

  const backToWelcome = () => {
    if (MIGRATION_REDIRECTION) {
      window.location.href = "/";
    } else {
      history.push("/");
    }
  };

  if (onboardingToBeDone) {
    return <Redirect to={`/${domain}/onboarding`} />;
  }

  return (
    <VaultCentered>
      <Card height={350} align="center" justify="center">
        {error ? (
          <>
            <TriggerErrorNotification error={error} />
            <Button type="submit" variant="filled" onClick={backToWelcome}>
              Go back
            </Button>
          </>
        ) : onboardingToBeDone === false ? (
          <DeviceInteraction
            interactions={loginFlow}
            onError={setError}
            onSuccess={onSuccess}
            additionalFields={{
              organization: {
                workspace: getDomainFromPath(match.path),
              },
            }}
          />
        ) : (
          <Spinner />
        )}
      </Card>
    </VaultCentered>
  );
}

function getDomainFromPath(path) {
  return path.split("/")[1];
}
