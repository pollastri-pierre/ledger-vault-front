// @flow

import React from "react";

import type { RuleWhitelist } from "./types";

// TODO remove those lines
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */

type Props = {
  rule: RuleWhitelist,
  onChange: RuleWhitelist => void,
};

const WhitelistParameters = (props: Props) => {
  return <div>lets assume there is a whitelist here</div>;
};

export default WhitelistParameters;
