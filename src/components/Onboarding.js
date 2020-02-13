// @flow

import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

import network from "network";
import { LoginLoading } from "components/Login";
import OnboardingContainer from "components/legacy/Onboarding/OnboardingContainer";
import SoftLogin from "components/SoftLogin";

const Onboarding = () => {
  const match = useRouteMatch();
  const history = useHistory();
  return (
    <RedirectIfOnboardingDone>
      <SoftLogin>
        <OnboardingContainer history={history} match={match} />
      </SoftLogin>
    </RedirectIfOnboardingDone>
  );
};

const RedirectIfOnboardingDone = ({ children }: { children: React$Node }) => {
  const isFetching = useRedirectIfOnboardingDone();
  if (isFetching) return <LoginLoading />;
  return children;
};

const useRedirectIfOnboardingDone = () => {
  const [isFetching, setFetching] = useState(true);
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    let unsub = false;
    const effect = async () => {
      const onboarding = await network("/onboarding/state", "GET");
      if (unsub) return;
      if (onboarding.state === "COMPLETE") {
        if (!match.params.workspace) {
          throw new Error("Invalid URL");
        }
        const redirect = `/${match.params.workspace}`;
        if (process.env.NODE_ENV === "production") {
          window.location.href = redirect;
        } else {
          history.replace(redirect);
        }
        return;
      }
      setFetching(false);
    };
    effect();
    return () => (unsub = true) && undefined;
  });

  return isFetching;
};

export default Onboarding;
