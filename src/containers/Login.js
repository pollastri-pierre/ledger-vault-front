// @flow

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import network from "network";
import { login } from "redux/modules/auth";
import { loginFlow } from "device/interactions/loginFlow";

import TriggerErrorNotification from "components/TriggerErrorNotification";
import DeviceInteraction from "components/DeviceInteraction";
import VaultCentered from "components/VaultCentered";
import Card from "components/base/Card";

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
        setError(e);
        console.error(e);
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

  if (onboardingToBeDone) {
    return <Redirect to={`/${domain}/onboarding`} />;
  }

  return (
    <VaultCentered>
      {error && <TriggerErrorNotification error={error} />}
      <Card height={350} align="center" justify="center">
        {onboardingToBeDone === false ? (
          <DeviceInteraction
            interactions={loginFlow}
            onError={setError}
            onSuccess={onSuccess}
          />
        ) : (
          "..."
        )}
      </Card>
    </VaultCentered>
  );
}

function getDomainFromPath(path) {
  return path.split("/")[1];
}
