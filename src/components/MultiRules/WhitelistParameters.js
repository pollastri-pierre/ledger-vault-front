// @flow

import React from "react";
import SelectWhitelist from "components/SelectWhitelist";

import { isRequestPending } from "utils/request";
import EntityStatus from "components/EntityStatus";
import type { Whitelist } from "data/types";
import type { RuleWhitelist } from "./types";

// TODO remove those lines
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */

type Props = {
  rule: RuleWhitelist,
  whitelists: Whitelist[],
  onChange: (RuleWhitelist) => void,
};

const WhitelistParameters = (props: Props) => {
  const { onChange, rule, whitelists } = props;
  const handleChange = (data) => {
    onChange({ ...rule, data: data.map((d) => d.id) });
  };
  return (
    <div>
      <SelectWhitelist
        value={rule.data.map((w) => (typeof w === "number" ? w : w.id))}
        onChange={handleChange}
        whitelists={whitelists}
        renderIfDisabled={renderIfDisabled}
      />
    </div>
  );
};

function renderIfDisabled(item: Whitelist) {
  return (
    item.last_request &&
    isRequestPending(item.last_request) && (
      <EntityStatus
        request={item.last_request}
        status={item.last_request.status}
      />
    )
  );
}

export default WhitelistParameters;
