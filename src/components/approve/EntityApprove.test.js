jest.mock("device/VaultDeviceApp");
jest.mock("@ledgerhq/hw-transport-u2f", () => ({
  create: jest.fn()
}));
jest.mock("network", () => jest.fn());
// import network from "network";
import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import {
  CONFIDENTIALITY_PATH,
  VALIDATION_PATH,
  U2F_PATH,
  ACCOUNT_MANAGER_SESSION,
  MATCHER_SESSION
} from "device";
import { EntityApprove } from "./EntityApprove";
import AbortConfirmation from "./AbortConfirmation";
import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import ApproveAccountMutation from "api/mutations/ApproveAccountMutation";
import ApproveOperationMutation from "api/mutations/ApproveOperationMutation";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import AbortAccount from "api/mutations/AbortAccountMutation";
import AbortOperationMutation from "api/mutations/AbortOperationMutation";
import AccountApprove from "../accounts/approve/AccountApprove";
import OperationApprove from "../operations/approve/OperationApprove";

import VaultDeviceApp, {
  mockOpenSession, // eslint-disable-line
  mockValidateVaultOperation, // eslint-disable-line
  mockGetPublicKey // eslint-disable-line
} from "device/VaultDeviceApp";

beforeEach(() => {
  VaultDeviceApp.mockClear();
  mockGetPublicKey.mockClear();
  mockOpenSession.mockClear();
  mockValidateVaultOperation.mockClear();
});

const props = {
  history: {
    goBack: jest.fn()
  },
  match: {
    params: {
      id: 1
    }
  },
  entity: "account",
  restlay: {
    commitMutation: jest.fn(),
    fetchQuery: jest.fn()
  }
};

test("it should set the proper initial state", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  expect(MyComponent.state()).toEqual({
    isDevice: false,
    isAborting: false,
    step: 0
  });
});

test("aborting() should set isAborting to !isAborting", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.instance().aborting();
  expect(MyComponent.state()).toEqual({
    isDevice: false,
    isAborting: true,
    step: 0
  });
  MyComponent.instance().aborting();
  expect(MyComponent.state()).toEqual({
    isDevice: false,
    isAborting: false,
    step: 0
  });
});

test("close() should call history's goBack()", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.instance().close();
  expect(props.history.goBack).toHaveBeenCalled();
});

test("!isDevice and isAborting should render AbortConfirmation", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.setState({ isDevice: false, isAborting: true });
  expect(MyComponent.find(AbortConfirmation).length).toBe(1);
});

test("!isDevice and isAborting should render AbortConfirmation with right props", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.setState({ isDevice: false, isAborting: true });
  const Abort = MyComponent.find(AbortConfirmation);
  expect(Abort.props()).toEqual({
    entity: "account",
    aborting: MyComponent.instance().aborting,
    abort: MyComponent.instance().abort
  });
});

test("isDevice and !isAborting should render StepDeviceGeneric", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.setState({ isDevice: true, isAborting: false });
  expect(MyComponent.find(StepDeviceGeneric).length).toBe(1);
});
test("isDevice and !isAborting should render StepDeviceGeneric with right props", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.setState({ isDevice: true, isAborting: false });
  const Steps = MyComponent.find(StepDeviceGeneric);

  expect(Steps.props()).toEqual({
    title: "Approve account",
    steps: MyComponent.instance().steps("account"),
    cancel: MyComponent.instance().approving,
    step: 0,
    device: true
  });
});
test("isDevice and !isAborting should render StepDeviceGeneric with right props if entity is operation", () => {
  const sProps = { ...props, entity: "operation" };
  const MyComponent = shallow(<EntityApprove {...sProps} />);
  MyComponent.setState({ isDevice: true, isAborting: false });
  const Steps = MyComponent.find(StepDeviceGeneric);

  expect(Steps.props()).toEqual({
    title: "Approve operation",
    steps: MyComponent.instance().steps("operation"),
    cancel: MyComponent.instance().approving,
    step: 0,
    device: true
  });
});

test("!isDevice and !isAborting and entity=account should render AccountApprove", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.setState({ isDevice: false, isAborting: false });
  expect(MyComponent.find(AccountApprove).length).toBe(1);
});
test("!isDevice and !isAborting and entity=account should render AccountApprove with right props", () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  MyComponent.setState({ isDevice: false, isAborting: false });
  const Approve = MyComponent.find(AccountApprove);
  expect(Approve.props()).toEqual({
    close: MyComponent.instance().close,
    approve: MyComponent.instance().approving,
    aborting: MyComponent.instance().aborting
  });
});
test("!isDevice and !isAborting and entity=operation should render OperationApprove", () => {
  const sProps = { ...props, entity: "operation" };
  const MyComponent = shallow(<EntityApprove {...sProps} />);
  MyComponent.setState({ isDevice: false, isAborting: false });
  expect(MyComponent.find(OperationApprove).length).toBe(1);
});
test("!isDevice and !isAborting and entity=account should render AccountApprove with right props", () => {
  const sProps = { ...props, entity: "operation" };
  const MyComponent = shallow(<EntityApprove {...sProps} />);
  MyComponent.setState({ isDevice: false, isAborting: false });
  const Approve = MyComponent.find(OperationApprove);
  expect(Approve.props()).toEqual({
    close: MyComponent.instance().close,
    approve: MyComponent.instance().approving,
    aborting: MyComponent.instance().aborting
  });
});

test("approving() should handle the approving process", async () => {
  const operation = {
    id: 1,
    hsm_operations: {
      PUBKEY: {
        data:
          "vNHbMwFRXF6Ct7yov5ZtOQIJc67TaXAJEYITCux+Ny34WaJJEKkybGbR+IKgLQZIvNynA7VF9r5tpWENoB/RyrALHWZxoDJlxaKcMXfOEhcRj6U6e9iD2Q==",
        ephemeral_public_key:
          "04A98E32A6839EC121D01221111316393101B50CA860E8D259D300548D4CAC4518FF8250C4B230BB5D9DF5F494F2D8F5C67AEE10EAF7EB5774EE06886A9067DDA2",
        certificate_attestation:
          "RjBEAiA5exkM47CKTyEAKHCCk4+ifF5WLi8PgLfTLq5k1YSKagIgT4wIKm3cqr4Wm1/4RVCi15mfcKoJsPaHM/4LUQDDjEQEUY/t0nhOkOr01JyAjEewiqMOzAWMMVfOcsBmjyOkHX6C0NrX/JmRCli6P0xghFjSoB1CL6Qf8kat0nfMWj/pkUcwRQIhAPeWfqcCJMPNBEdxf/HXw7tnM4Jr9A9cDS5vmZR8epPLAiBmOL+N4Q7izgOx3CgVMCmSE97NxBaVmMYSqPyY+x3tnw=="
      }
    }
  };
  const MyComponent = shallow(<EntityApprove {...props} />);
  await MyComponent.instance().approving(operation);
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);
  expect(mockOpenSession).toHaveBeenCalledWith(
    CONFIDENTIALITY_PATH,
    Buffer.from(
      operation.hsm_operations["PUBKEY"]["ephemeral_public_key"],
      "hex"
    ),
    Buffer.from(
      operation.hsm_operations["PUBKEY"]["certificate_attestation"],
      "base64"
    ),
    ACCOUNT_MANAGER_SESSION
  );

  expect(mockValidateVaultOperation).toHaveBeenCalledWith(
    VALIDATION_PATH,
    Buffer.from(operation.hsm_operations["PUBKEY"]["data"], "base64")
  );

  expect(props.restlay.commitMutation).toHaveBeenCalledWith(
    new ApproveAccountMutation({
      accountId: 1,
      approval: "approval",
      public_key: "PUBKEY"
    })
  );
});

test("approving() should handle the approving process with entity=acocunt and MATCHER_SESSION", async () => {
  const operation = {
    id: 1,
    hsm_operations: {
      PUBKEY: {
        data:
          "vNHbMwFRXF6Ct7yov5ZtOQIJc67TaXAJEYITCux+Ny34WaJJEKkybGbR+IKgLQZIvNynA7VF9r5tpWENoB/RyrALHWZxoDJlxaKcMXfOEhcRj6U6e9iD2Q==",
        ephemeral_public_key:
          "04A98E32A6839EC121D01221111316393101B50CA860E8D259D300548D4CAC4518FF8250C4B230BB5D9DF5F494F2D8F5C67AEE10EAF7EB5774EE06886A9067DDA2",
        certificate_attestation:
          "RjBEAiA5exkM47CKTyEAKHCCk4+ifF5WLi8PgLfTLq5k1YSKagIgT4wIKm3cqr4Wm1/4RVCi15mfcKoJsPaHM/4LUQDDjEQEUY/t0nhOkOr01JyAjEewiqMOzAWMMVfOcsBmjyOkHX6C0NrX/JmRCli6P0xghFjSoB1CL6Qf8kat0nfMWj/pkUcwRQIhAPeWfqcCJMPNBEdxf/HXw7tnM4Jr9A9cDS5vmZR8epPLAiBmOL+N4Q7izgOx3CgVMCmSE97NxBaVmMYSqPyY+x3tnw=="
      }
    }
  };
  const sProps = { ...props, entity: "operation" };
  const MyComponent = shallow(<EntityApprove {...sProps} />);
  await MyComponent.instance().approving(operation);
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);
  expect(mockOpenSession).toHaveBeenCalledWith(
    CONFIDENTIALITY_PATH,
    Buffer.from(
      operation.hsm_operations["PUBKEY"]["ephemeral_public_key"],
      "hex"
    ),
    Buffer.from(
      operation.hsm_operations["PUBKEY"]["certificate_attestation"],
      "base64"
    ),
    MATCHER_SESSION
  );

  expect(mockValidateVaultOperation).toHaveBeenCalledWith(
    VALIDATION_PATH,
    Buffer.from(operation.hsm_operations["PUBKEY"]["data"], "base64")
  );

  expect(sProps.restlay.commitMutation).toHaveBeenCalledWith(
    new ApproveOperationMutation({
      operationId: 1,
      approval: "approval",
      public_key: "PUBKEY"
    })
  );
});

test("abort() should handle the abort process for account", async () => {
  const MyComponent = shallow(<EntityApprove {...props} />);
  await MyComponent.instance().abort();
  expect(props.restlay.commitMutation).toHaveBeenCalledWith(
    new AbortAccount({
      accountId: 1
    })
  );
  expect(props.restlay.fetchQuery).toHaveBeenCalledWith(
    new PendingAccountsQuery()
  );
  expect(props.history.goBack).toHaveBeenCalled();
});

test("abort() should handle the abort process for operation", async () => {
  const sProps = { ...props, entity: "operation" };
  const MyComponent = shallow(<EntityApprove {...sProps} />);
  await MyComponent.instance().abort();
  expect(props.restlay.commitMutation).toHaveBeenCalledWith(
    new AbortOperationMutation({
      operationId: 1
    })
  );
  expect(props.restlay.fetchQuery).toHaveBeenCalledWith(
    new PendingOperationsQuery()
  );
  expect(props.history.goBack).toHaveBeenCalled();
});
