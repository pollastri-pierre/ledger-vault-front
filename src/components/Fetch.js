// @flow

import React, { useState, useEffect } from "react";

import Spinner from "components/base/Spinner";
import TranslatedError from "components/TranslatedError";
import Box from "components/base/Box";
import network from "network";

type Props<T> = {
  url: string,
  deserialize?: any => T,
  children: T => React$Node,
};

const spinner = (
  <Box align="center">
    <Spinner />
  </Box>
);

export default function Fetch<T>(props: Props<T>) {
  const { url, deserialize, children } = props;

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let unsub = false;
    const effect = async () => {
      try {
        let res = await network(url, "GET");
        if (unsub) return;
        if (deserialize) {
          res = deserialize(res);
        }
        setLoading(false);
        setData(res);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };
    effect();
    return () => {
      unsub = true;
    };
  }, [url, deserialize]);

  if (isLoading) {
    return spinner;
  }

  if (error) {
    return <TranslatedError error={error} />;
  }

  if (!data) {
    return "Nothing to display";
  }

  return children(data);
}
