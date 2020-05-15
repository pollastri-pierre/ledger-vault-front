// @flow

import React, { useReducer } from "react";
import moment from "moment";
import { Trans } from "react-i18next";
import { components } from "react-select";
import { storiesOf } from "@storybook/react";
import type { OptionProps } from "react-select/src/types";

import backendDecorator from "stories/backendDecorator";

import {
  genAccounts,
  genGroups,
  genUsers,
  genTransactions,
  genApprovals,
} from "data/mock-entities";

import {
  UserStatusMap,
  GroupStatusMap,
  AccountStatusMap,
  TransactionStatusMap,
} from "data/types";

import UserContextProvider from "components/UserContextProvider";
import Modal from "components/base/Modal";
import Box from "components/base/Box";
import Select from "components/base/Select";
import { Label, Switch } from "components/base/form";
import Status from "components/Status";
import EntityFooter from "components/EntityFooter";

import type { Option } from "components/base/Select";

storiesOf("components", module)
  .addDecorator(
    backendDecorator([
      {
        url: "/requests/1/abort",
        res: () => ({}),
      },
      {
        url: "/requests/2/abort",
        res: () => {
          const choices = [
            "gate",
            "daemon",
            "hsm exception",
            "tilt",
            "no internet",
            "TAMS",
          ];
          const choice = choices[Math.floor(choices.length * Math.random())];
          throw new Error(`Probably because of ${choice}`);
        },
      },
      {
        url:
          "/requests?order=asc&pageSize=-1&status=PENDING_APPROVAL&status=PENDING_REGISTRATION",
        res: () => [],
      },
    ]),
  )
  .add("EntityFooter", () => <Wrapper />);

const users = genUsers(2);
const accounts = genAccounts(1, { users: [users[0]] });
const transactions = genTransactions(1, { accounts, users: [users[0]] });
const groups = genGroups(1, { users: [users[0]] });
const me = users[1];

const statusesByEntity = {
  USER: UserStatusMap,
  GROUP: GroupStatusMap,
  ACCOUNT: AccountStatusMap,
  TRANSACTION: TransactionStatusMap,
};

const entitiesOptions: Option[] = [
  {
    label: "User",
    value: "USER",
    data: users[0],
  },
  {
    label: "Group",
    value: "GROUP",
    data: groups[0],
  },
  {
    label: "Account",
    value: "ACCOUNT",
    data: accounts[0],
  },
  {
    label: "Transaction",
    value: "TRANSACTION",
    data: transactions[0],
  },
];

const possibleRequests = {
  USER: {
    ACTIVE: ["", "REVOKE_USER"],
    ABORTED: [],
    ACCESS_SUSPENDED: [],
    REVOKED: [],
    PENDING_APPROVAL: ["CREATE_ADMIN", "CREATE_OPERATOR"],
    PENDING_REVOCATION: ["REVOKE_USER"],
    PENDING_REGISTRATION: ["CREATE_ADMIN", "CREATE_OPERATOR"],
  },
  GROUP: {
    ACTIVE: ["", "EDIT_GROUP", "REVOKE_GROUP"],
    PENDING: ["CREATE_GROUP"],
    REVOKED: [],
    ABORTED: [],
  },
  ACCOUNT: {
    ACTIVE: ["", "EDIT_ACCOUNT"],
    VIEW_ONLY: ["", "EDIT_ACCOUNT"],
    REVOKED: [],
    MIGRATED: ["", "MIGRATE_ACCOUNT"],
    HSM_COIN_UPDATED: ["", "EDIT_ACCOUNT"],
    PENDING: ["CREATE_ACCOUNT"],
    PENDING_UPDATE: ["EDIT_ACCOUNT"],
    PENDING_VIEW_ONLY: ["EDIT_ACCOUNT"],
    PENDING_MIGRATED: ["EDIT_ACCOUNT"],
  },
  TRANSACTION: {
    PENDING_APPROVAL: ["CREATE_TRANSACTION"],
  },
};

const getStatusesOptions = (entity) => {
  const map = statusesByEntity[entity.value];
  const statuses = Object.keys(map);
  return statuses.map((s) => ({ label: s, value: s, data: s }));
};

const getRequestTypeOptions = (entityOpt, statusOpt): Option[] => {
  const statuses = possibleRequests[entityOpt.value];
  if (!statuses) return [];
  const reqs = statuses[statusOpt.value];
  if (!reqs || !reqs.length) return [];
  return reqs.map((r) => ({
    label: r ? <Trans i18nKey={`request:type.${r}`} /> : "(no request)",
    data: r || null,
    value: r || null,
  }));
};

const buildEntity = ({
  entityOpt,
  statusOpt,
  reqTypeOpt,
  hasApproved,
  inCurrentStep,
  reqFail,
}) => {
  const entity = {
    ...entityOpt.data,
    status: statusOpt.value,
  };
  if (reqTypeOpt && reqTypeOpt.value) {
    const approvals = hasApproved
      ? genApprovals(1, { users: [me] }).map((a) => ({
          ...a,
          type: "APPROVE",
        }))
      : [];

    const approvals_steps = [null, { group: { members: [me] } }];

    entity.last_request = {
      id: reqFail ? 2 : 1,
      type: reqTypeOpt.value,
      current_step: inCurrentStep ? 1 : 0,
      approvals_steps,
      approvals,
      expired_at: moment().add(5, "days").toDate(),
    };
  }
  return entity;
};

const entityOpt = entitiesOptions[0];
const statusesOpts = getStatusesOptions(entitiesOptions[0]);
const statusOpt = statusesOpts[4];
const reqTypeOpts = getRequestTypeOptions(entityOpt, statusOpt);
const reqTypeOpt = reqTypeOpts[0];
const hasApproved = false;
const inCurrentStep = true;
const reqFail = false;

const entity = buildEntity({
  entityOpt,
  statusOpt,
  reqTypeOpt,
  hasApproved,
  inCurrentStep,
  reqFail,
});

const initialState = {
  entity,
  entityOpt,
  statusesOpts,
  statusOpt,
  reqTypeOpts,
  reqTypeOpt,
  hasApproved,
  inCurrentStep,
  reqFail,
};

const reducer = (state, action) => {
  let entity;
  let entityOpt;
  let statusesOpts;
  let statusOpt;
  let reqTypeOpts;
  let reqTypeOpt;
  let hasApproved;
  let inCurrentStep;
  let reqFail;

  switch (action.type) {
    case "SET_ENTITY":
      entityOpt = action.payload;
      statusesOpts = getStatusesOptions(entityOpt);
      statusOpt = statusesOpts[0];
      reqTypeOpts = getRequestTypeOptions(entityOpt, statusOpt);
      reqTypeOpt = reqTypeOpts[0] || null;
      entity = buildEntity({ ...state, entityOpt, statusOpt, reqTypeOpt });
      return {
        ...state,
        entity,
        entityOpt,
        statusesOpts,
        statusOpt,
        reqTypeOpts,
        reqTypeOpt,
      };
    case "SET_STATUS":
      statusOpt = action.payload;
      reqTypeOpts = getRequestTypeOptions(state.entityOpt, statusOpt);
      reqTypeOpt = reqTypeOpts[0] || null;
      entity = buildEntity({ ...state, statusOpt, reqTypeOpt });
      return { ...state, entity, statusOpt, reqTypeOpts, reqTypeOpt };
    case "SET_REQ_TYPE":
      reqTypeOpt = action.payload;
      entity = buildEntity({ ...state, reqTypeOpt });
      return { ...state, entity, reqTypeOpt };
    case "SET_HAS_APPROVED":
      hasApproved = action.payload;
      entity = buildEntity({ ...state, hasApproved });
      return { ...state, entity, hasApproved };
    case "SET_CURRENT_STEP":
      inCurrentStep = action.payload;
      entity = buildEntity({ ...state, inCurrentStep });
      return { ...state, entity, inCurrentStep };
    case "SET_FAIL":
      reqFail = action.payload;
      entity = buildEntity({ ...state, reqFail });
      return { ...state, entity, reqFail };
    default:
      return state;
  }
};

const Wrapper = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    entity,
    entityOpt,
    statusesOpts,
    statusOpt,
    reqTypeOpts,
    reqTypeOpt,
    reqFail,
  } = state;

  const onChangeEntity = (entityOpt) =>
    dispatch({ type: "SET_ENTITY", payload: entityOpt });

  const onChangeEntityStatus = (statusOpt) =>
    dispatch({ type: "SET_STATUS", payload: statusOpt });

  const onChangeReqType = (reqTypeOpt) =>
    dispatch({ type: "SET_REQ_TYPE", payload: reqTypeOpt });

  const toggleApproved = () =>
    dispatch({
      type: "SET_HAS_APPROVED",
      payload: !state.hasApproved,
    });

  const toggleCurrentStep = () =>
    dispatch({
      type: "SET_CURRENT_STEP",
      payload: !state.inCurrentStep,
    });

  const toggleFail = () => dispatch({ type: "SET_FAIL", payload: !reqFail });

  return (
    <UserContextProvider me={me}>
      <Modal isOpened>
        <Box width={600} p={40} flow={20}>
          <Box horizontal flow={20}>
            <Box flex={1}>
              <Label>Entity</Label>
              <Select
                options={entitiesOptions}
                value={entityOpt}
                onChange={onChangeEntity}
              />
            </Box>
            <Box flex={1}>
              <Label>Entity status</Label>
              <Select
                options={statusesOpts}
                value={statusOpt}
                onChange={onChangeEntityStatus}
                components={customComponents}
              />
            </Box>
          </Box>
          <Box horizontal flow={20}>
            <Box flex={1}>
              <Label>Last request</Label>
              <Select
                isDisabled={!reqTypeOpts.length}
                options={reqTypeOpts}
                value={reqTypeOpt}
                onChange={onChangeReqType}
                placeholder="(no request)"
              />
            </Box>
            <Box flex={1}>
              {reqTypeOpt && reqTypeOpt.data ? (
                <>
                  <Label>Options</Label>
                  <Box flow={10}>
                    <Box
                      horizontal
                      align="center"
                      style={{ cursor: "pointer" }}
                      onClick={toggleCurrentStep}
                      flow={10}
                    >
                      <Switch
                        onChange={toggleCurrentStep}
                        value={state.inCurrentStep}
                      />
                      <div>User in current step</div>
                    </Box>
                    <Box
                      horizontal
                      align="center"
                      style={{ cursor: "pointer" }}
                      onClick={toggleApproved}
                      flow={10}
                    >
                      <Switch
                        onChange={toggleApproved}
                        value={state.hasApproved}
                      />
                      <div>User has approved</div>
                    </Box>
                    <Box
                      horizontal
                      align="center"
                      style={{ cursor: "pointer" }}
                      onClick={toggleFail}
                      flow={10}
                    >
                      <Switch onChange={toggleFail} value={state.reqFail} />
                      <div>Make any request fail</div>
                    </Box>
                  </Box>
                </>
              ) : null}
            </Box>
          </Box>
        </Box>
        <EntityFooter entity={entity} />
      </Modal>
    </UserContextProvider>
  );
};

const StatusSelectRow = (props: OptionProps) => (
  <Status status={props.data.value} />
);

const OptionComponent = (props: OptionProps) => (
  <components.Option {...props}>
    <StatusSelectRow {...props} />
  </components.Option>
);

const ValueComponent = (props: OptionProps) => (
  <components.SingleValue {...props}>
    <StatusSelectRow {...props} />
  </components.SingleValue>
);

const customComponents = {
  Option: OptionComponent,
  SingleValue: ValueComponent,
};
