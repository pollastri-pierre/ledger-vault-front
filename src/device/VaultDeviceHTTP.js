// @flow
import network from "network";

export const ENDPOINTS = {
  GET_PUBLIC_KEY: "/get-public-key",
  GET_ATTESTATION: "/get-attestation",
  OPEN_SESSION: "/open-session",
  AUTHENTICATE: "/authenticate",
  REGISTER: "/register",
  VALIDATE_VAULT_OPERATION: "/validate-vault-operation",
  GENERATE_KEY_FRAGMENTS: "/generate-key-fragments",
  REGISTER_DATA: "/u2f-register-data",
};

const pathArrayToString = (path: number[]): string =>
  `${path[0] & 0xfffffff}'/${path[1] & 0xfffffff}'`; // eslint-disable-line no-bitwise

const deviceNetwork = async function<T>(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>),
  noJson?: boolean,
): Promise<T> {
  return network(uri, method, body, null, {
    noJson: noJson || false,
  }).catch(err => {
    console.error(err);
    if (err.json.status_code) {
      // TODO do we really want to throw a literal here?
      throw { statusCode: err.json.status_code }; // eslint-disable-line no-throw-literal
    } else {
      throw err;
    }
  });
};

const fromStringRoleToBytes = {
  shared_owner: Buffer.from([2]),
  admin: Buffer.from([1]),
  operator: Buffer.from([0]),
};

const psdType = Buffer.from([0]);

export const registerData = async (
  transport: *,
  challenge: Buffer,
): Promise<*> => {
  const data = await deviceNetwork(ENDPOINTS.REGISTER_DATA, "POST", {
    challenge: challenge.toString("hex"),
  });

  return Buffer.from(data, "hex");
};

export const register = async (
  transport: *,
  challenge: Buffer,

  application: string,
  name: string,
  userRole: string,
  registerData: Buffer,

  // instanceName: string,
  // instanceReference: string,
  // instanceUrl: string,
  // agentRole: string,
): Promise<{
  u2f_register: Buffer,
  keyHandle: Buffer,
}> => {
  const data = await deviceNetwork(ENDPOINTS.REGISTER, "POST", {
    challenge: challenge.toString("hex"),
    name,
    role: fromStringRoleToBytes[userRole].toString("hex"),
    hsm_data: registerData.toString("hex"),
    type: psdType.toString("hex"),
    application,

    // name: instanceName,
    // role: agentRole,
    // domain_name: instanceUrl,
    // workspace: instanceReference,
  });
  const response = Buffer.from(data, "hex");
  let i = 0;
  const rfu = response.slice(i, (i += 1))[0];
  const pubKey = response.slice(i, (i += 65)).toString("hex");
  const keyHandleLength = response.slice(i, ++i)[0];
  const keyHandle = response.slice(i, (i += keyHandleLength));
  // const attestationSignature = lastResponse.slice(i, ++i)[0];
  // const signature = lastResponse.slice(i).toString("hex");
  return {
    u2f_register: response.slice(0, response.length - 2),
    keyHandle,
    rfu,
    pubKey,
  };
};
export const generateKeyComponent = async (
  transport: *,
  path: number[],
  isWrappingKey: boolean,
): Promise<*> => {
  let p1 = 0x00;
  if (isWrappingKey) {
    p1 = 0x01;
  }
  const data = await deviceNetwork(ENDPOINTS.GENERATE_KEY_FRAGMENTS, "POST", {
    path: pathArrayToString(path),
    goal: p1,
  });
  return Buffer.from(data, "hex");
};

export const getAttestationCertificate = async (): Promise<Buffer> => {
  const data = await deviceNetwork(
    ENDPOINTS.GET_ATTESTATION,
    "GET",
    null,
    true,
  );
  return Buffer.from(data, "hex");
};

export const validateVaultOperation = async (
  transport: *,
  path: number[],
  operation: Buffer,
) => {
  const data = await deviceNetwork(ENDPOINTS.VALIDATE_VAULT_OPERATION, "POST", {
    path: pathArrayToString(path),
    operation: operation.toString("hex"),
  });
  return Buffer.from(data, "hex");
};
export const openSession = async (
  transport: *,
  path: number[],
  pubKey: Buffer,
  attestation: Buffer,
  scriptHash: number = 0x00,
): Promise<*> => {
  const data = await deviceNetwork(ENDPOINTS.OPEN_SESSION, "POST", {
    path: pathArrayToString(path),
    pubKey: pubKey.toString("hex"),
    attestation: attestation.toString("hex"),
    scriptHash,
  });
  return data;
};

export const getPublicKey = async (
  transport: *,
  path: number[],
  secp256k1: boolean = true,
): Promise<{
  pubKey: string,
  signature: string,
}> => {
  const data = await deviceNetwork(ENDPOINTS.GET_PUBLIC_KEY, "POST", {
    path: pathArrayToString(path),
    secp256k1,
  });
  return {
    pubKey: data.pubKey,
    signature: Buffer.from(data.attestation, "hex"),
  };
};
export const authenticate = async (
  transport: *,
  challenge: Buffer,
  application: string,
  keyHandle: Buffer,
  userName: string,
  role: string,
  // instanceUrl: string,
  // agentRole: string,
): Promise<{
  userPresence: *,
  counter: *,
  signature: string,
  rawResponse: string,
}> => {
  const data = await deviceNetwork(ENDPOINTS.AUTHENTICATE, "POST", {
    challenge: challenge.toString("hex"),
    application,
    key_handle: keyHandle.toString("hex"),
    name: userName,
    role: fromStringRoleToBytes[role].toString("hex"),
    type: psdType.toString("hex"),
    // domain_name: instanceUrl,
    // workspace: instanceReference,
  });

  // we add a fake status response because traaansport on device does it
  const response = Buffer.concat([
    Buffer.from(data, "hex"),
    Buffer.from("9000", "hex"),
  ]);

  const userPresence = response.slice(0, 1);
  const counter = response.slice(1, 5);
  const signature = response.slice(5, response.length - 2).toString("hex");
  return {
    userPresence,
    counter,
    signature,
    rawResponse: response.slice(0, response.length - 2).toString("hex"),
  };
};
export default class VaultDeviceHTTP {
  async getPublicKey(
    path: number[],
    secp256k1: boolean = true,
  ): Promise<{
    pubKey: string,
    signature: string,
  }> {
    const data = await deviceNetwork(ENDPOINTS.GET_PUBLIC_KEY, "POST", {
      path: pathArrayToString(path),
      secp256k1,
    });
    return {
      pubKey: data.pubKey,
      signature: Buffer.from(data.attestation, "hex"),
    };
  }

  async getAttestationCertificate(): Promise<Buffer> {
    const data = await deviceNetwork(ENDPOINTS.GET_ATTESTATION, "GET");
    return Buffer.from(data, "hex");
  }

  async generateKeyComponent(
    path: number[],
    isWrappingKey: boolean,
  ): Promise<*> {
    let p1 = 0x00;
    if (isWrappingKey) {
      p1 = 0x01;
    }
    const data = await deviceNetwork(ENDPOINTS.GENERATE_KEY_FRAGMENTS, "POST", {
      path: pathArrayToString(path),
      goal: p1,
    });
    return Buffer.from(data, "hex");
  }

  async authenticate(
    challenge: Buffer,
    application: string,
    keyHandle: Buffer,
    instanceName: string,
    instanceReference: string,
    instanceUrl: string,
    agentRole: string,
  ): Promise<{
    userPresence: *,
    counter: *,
    signature: string,
    rawResponse: string,
  }> {
    const data = await deviceNetwork(ENDPOINTS.AUTHENTICATE, "POST", {
      challenge: challenge.toString("hex"),
      application,
      key_handle: keyHandle.toString("hex"),
      name: instanceName,
      role: agentRole,
      domain_name: instanceUrl,
      workspace: instanceReference,
    });

    // we add a fake status response because traaansport on device does it
    const response = Buffer.concat([
      Buffer.from(data, "hex"),
      Buffer.from("9000", "hex"),
    ]);

    const userPresence = response.slice(0, 1);
    const counter = response.slice(1, 5);
    const signature = response.slice(5, response.length - 2).toString("hex");
    return {
      userPresence,
      counter,
      signature,
      rawResponse: response.slice(0, response.length - 2).toString("hex"),
    };
  }

  async register(
    challenge: Buffer,

    userName: string,
    roleName: string,
    registerData: Buffer,

    application: string,
    instanceName: string,
    instanceReference: string,
    instanceUrl: string,
    agentRole: string,
  ): Promise<{
    u2f_register: Buffer,
    keyHandle: Buffer,
  }> {
    const data = await deviceNetwork(ENDPOINTS.REGISTER, "POST", {
      challenge: challenge.toString("hex"),
      application,
      name: instanceName,
      role: agentRole,
      domain_name: instanceUrl,
      workspace: instanceReference,
    });
    const response = Buffer.from(data, "hex");
    let i = 0;
    const rfu = response.slice(i, (i += 1))[0];
    const pubKey = response.slice(i, (i += 65)).toString("hex");
    const keyHandleLength = response.slice(i, ++i)[0];
    const keyHandle = response.slice(i, (i += keyHandleLength));
    // const attestationSignature = lastResponse.slice(i, ++i)[0];
    // const signature = lastResponse.slice(i).toString("hex");
    return {
      u2f_register: response.slice(0, response.length - 2),
      keyHandle,
      rfu,
      pubKey,
    };
  }

  async openSession(
    path: number[],
    pubKey: Buffer,
    attestation: Buffer,
    scriptHash: number = 0x00,
  ): Promise<*> {
    const data = await deviceNetwork(ENDPOINTS.OPEN_SESSION, "POST", {
      path: pathArrayToString(path),
      pubKey: pubKey.toString("hex"),
      attestation: attestation.toString("hex"),
      scriptHash,
    });
    return data;
  }

  // TODO call the device API instead to be more confidnent our code is correct regarding the apdu response handling
  async getVersion(): Promise<{ appName: string, appVersion: string }> {
    const promise = Promise.resolve({
      appName: "Vault",
      appVersion: window.config.APP_VERSION,
    });

    return promise;
  }

  async validateVaultOperation(path: number[], operation: Buffer) {
    const data = await deviceNetwork(
      ENDPOINTS.VALIDATE_VAULT_OPERATION,
      "POST",
      {
        path: pathArrayToString(path),
        operation: operation.toString("hex"),
      },
    );
    return Buffer.from(data, "hex");
  }
}
