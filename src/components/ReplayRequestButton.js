// @flow

import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { FaRedoAlt } from "react-icons/fa";

import { useMe } from "components/UserContextProvider";
import Box from "components/base/Box";
import Button from "components/base/Button";
import { setRequest } from "redux/modules/requestReplayStore";
import type { User } from "data/types";
import type { RequestReplay } from "redux/modules/requestReplayStore";
import { getModalClosePath } from "utils/modal";

const mapDispatch = {
  setRequest,
};

// HACKY: routing nightmare
// see tests in src/components/ReplayRequestButton.test.js for better understanding on WHY
export const getUrlFromRequest = (
  r: RequestReplay,
  path: string,
  me: User,
): string => {
  const closePath = getModalClosePath(path, me);

  const mapEntity = {
    GROUP: "groups",
    ACCOUNT: "accounts",
    WHITELIST: "whitelists",
    TRANSACTION: "transactions",
    USER: "users",
  };

  const creationSuffix = r.entity.entityType === "TRANSACTION" ? "send" : "new";

  const closePathArray = closePath && closePath.split("/");
  const lastPart = closePathArray && closePathArray[closePathArray.length - 1];

  const entityPrefix =
    mapEntity[r.entity.entityType] === lastPart
      ? ""
      : `${mapEntity[r.entity.entityType]}/`;

  const push =
    r.type === "EDIT"
      ? `${entityPrefix}edit/${r.entity.id}`
      : `${entityPrefix}${creationSuffix}`;

  if (!closePath) return push;
  return `${closePath}/${push}`;
};

type Props = {
  setRequest: RequestReplay => void,
  request: RequestReplay,
  disabledReason: ?string,
};

const ReplayRequestButton = ({
  request,
  setRequest,
  disabledReason,
}: Props) => {
  const { t } = useTranslation();
  const me = useMe();
  const history = useHistory();
  const { pathname } = history.location;

  const onClick = () => {
    setRequest(request);
    history.push(getUrlFromRequest(request, pathname, me));
  };

  const button = (
    <Button
      type="filled"
      size="small"
      onClick={onClick}
      disabled={!!disabledReason}
    >
      <Box horizontal flow={5} align="center">
        <FaRedoAlt size={11} />
        <div>{t("history:replay")}</div>
      </Box>
    </Button>
  );
  let inner;
  // have to wrap it inside a DIV because disabled button swallow hover event
  if (disabledReason) {
    inner = (
      <Tooltip
        title={t(disabledReason, {
          entityType: request.entity.entityType.toLowerCase(),
        })}
      >
        <div>{button}</div>
      </Tooltip>
    );
  } else {
    inner = button;
  }

  return (
    <Box align="flex-end">
      <Box>{inner}</Box>
    </Box>
  );
};

export default connect(undefined, mapDispatch)(ReplayRequestButton);
