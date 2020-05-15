// @flow
import type Transport from "@ledgerhq/hw-transport";
import {
  fromStringRoleToBytes,
  STREAMING_RESPONSE,
  STREAMING_NEXT_ACTION,
  PAGINATED_STATUS,
} from "device";
import invariant from "invariant";

const STATUS_LENGTH = 2;
const MAX_CHUNK_LENGTH = 250;
const removeStatus = (result: Buffer): Buffer =>
  result.slice(0, result.length - STATUS_LENGTH);

const splits = (chunk: number, buffer: Buffer): Buffer[] => {
  const chunks = [];
  for (let i = 0, size = chunk; i < buffer.length; i += size, size = chunk) {
    chunks.push(buffer.slice(i, i + size));
  }
  return chunks;
};
export const getFirmwareInfo = async (
  transport: Transport<*>,
): Promise<{
  targetId: string,
  seVersion: string,
  flags: string,
  mcuVersion: string,
}> => {
  const res = await transport.send(0xe0, 0x01, 0x00, 0x00);
  const data = [...res];
  const targetIdStr = Buffer.from(data.slice(0, 4));
  const targetId = targetIdStr.readUIntBE(0, 4);
  const seVersionLength = data[4];
  const seVersion = Buffer.from(data.slice(5, 5 + seVersionLength)).toString();
  const flagsLength = data[5 + seVersionLength];
  const flags = Buffer.from(
    data.slice(5 + seVersionLength + 1, 5 + seVersionLength + 1 + flagsLength),
  ).toString();

  const mcuVersionLength = data[5 + seVersionLength + 1 + flagsLength];
  let mcuVersion = Buffer.from(
    data.slice(
      7 + seVersionLength + flagsLength,
      7 + seVersionLength + flagsLength + mcuVersionLength,
    ),
  );
  if (mcuVersion[mcuVersion.length - 1] === 0) {
    mcuVersion = mcuVersion.slice(0, mcuVersion.length - 1);
  }
  mcuVersion = mcuVersion.toString();

  if (!seVersionLength) {
    return {
      targetId,
      seVersion: "0.0.0",
      flags: "",
      mcuVersion: "",
    };
  }

  return { targetId, seVersion, flags, mcuVersion };
};

export const generateKeyComponent = async (
  transport: Transport<*>,
  path: number[],
  isWrappingKey: boolean,
): Promise<Buffer> => {
  const data = Buffer.concat([
    Buffer.from([path.length]),
    ...path.map((derivation) => {
      const buf = Buffer.alloc(4);
      buf.writeUInt32BE(derivation, 0);
      return buf;
    }),
  ]);
  let p1 = 0x00;
  if (isWrappingKey) {
    p1 = 0x01;
  }
  const response = await transport.send(0xe0, 0x44, p1, 0x00, data);
  return removeStatus(response);
};

export const getAttestationCertificate = async (
  transport: Transport<*>,
): Promise<Buffer> => {
  const response = await transport.send(0xe0, 0x41, 0x00, 0x00);
  return removeStatus(response);
};

export const getVersion = async (
  transport: Transport<*>,
): Promise<{ appName: string, appVersion: string }> => {
  const res = await transport.send(0xb0, 0x01, 0x00, 0x00);
  // const version = res.readInt8(0);
  const appNameLen = res.readInt8(1);
  const appNameHex = res.slice(2, appNameLen + 2);
  const appName = Buffer.from(appNameHex).toString();
  const appVersionLen = res.readInt8(2 + appNameLen);
  const appVersionHex = res.slice(
    2 + 1 + appNameLen,
    2 + appNameLen + appVersionLen + 1,
  );

  const appVersion = Buffer.from(appVersionHex).toString();

  return {
    appName,
    appVersion,
  };
};

// FIXME we should check that the first chunk contains at least the length of all the data
export const sendByChunk = async (
  transport: Transport<*>,
  command: number[], // eg [0xe0, 0x45, 0x00, 0x00]
  data: Buffer,
  chunkSize: number = MAX_CHUNK_LENGTH,
) => {
  const chunks = splits(chunkSize, data);
  let response = Buffer.from([]);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const apdu = [...command];
    // command is 0xe0,0x45,0x00,0x00 for first chunk, then it's 0xe0,0x45, 0x80,0x00
    apdu[2] = i && 0x80;
    response = await transport.send(apdu[0], apdu[1], apdu[2], apdu[3], chunk, [
      0x9000,
      ...PAGINATED_STATUS,
    ]);
  }
  return response;
};

export const validateVaultOperation = async (
  transport: Transport<*>,
  path: number[],
  operation: { blob: string, w_actions: string[] },
) => {
  const paths = Buffer.concat([
    Buffer.from([path.length]),
    ...path.map((derivation) => {
      const buf = Buffer.alloc(4);
      buf.writeUInt32BE(derivation, 0);
      return buf;
    }),
  ]);

  let nextActionId = 1;
  let finalResponse;

  while (!finalResponse) {
    const screen = Buffer.from(operation.w_actions[nextActionId - 1], "base64");
    const length = Buffer.alloc(2);
    length.writeUInt16BE(screen.length, 0);
    const data = Buffer.concat([paths, length, screen]);
    const response = await sendByChunk(
      transport,
      [0xe0, 0x45, 0x00, 0x00],
      data,
    );
    const responseType = response.readInt8(0);
    let responseStatus = response.readUInt16BE(response.length - 2);

    if (responseType === STREAMING_NEXT_ACTION) {
      nextActionId = response.readUIntBE(1, 2);
    } else if (responseType === STREAMING_RESPONSE) {
      finalResponse = response.slice(3, response.length - 2);
      while (responseStatus !== 0x9000) {
        const resp = await transport.send(0x00, 0xc0, 0x00, 0x00);
        responseStatus = resp.readUInt16BE(resp.length - 2);
        finalResponse = Buffer.concat([finalResponse, removeStatus(resp)]);
      }
    } else {
      throw Error(`${responseType}`);
    }
  }
  return finalResponse;
};

export const openSession = async (
  transport: Transport<*>,
  path: number[],
  pubKey: Buffer,
  attestation: Buffer,
  scriptHash: number = 0x00,
): Promise<*> => {
  const dataDerivation = Buffer.concat([
    Buffer.from([path.length]),
    ...path.map((derivation) => {
      const buf = Buffer.alloc(4);
      buf.writeUInt32BE(derivation, 0);
      return buf;
    }),
  ]);

  const lengthAttestation = Buffer.alloc(2);
  lengthAttestation.writeUInt16BE(attestation.length, 0);

  const data = Buffer.concat([
    dataDerivation,
    pubKey,
    lengthAttestation,
    attestation,
  ]);

  const response = await sendByChunk(
    transport,
    [0xe0, 0x42, 0x00, scriptHash],
    data,
  );
  return response;
};

export const registerData = async (
  transport: Transport<*>,
  challenge: Buffer,
): Promise<*> => {
  invariant(
    challenge.length === 32,
    "challenge hex is expected to have 32 bytes",
  );

  const response = await transport.send(0xe0, 0x03, 0x00, 0x00, challenge);
  return removeStatus(response);
};

export const register = async (
  transport: Transport<*>,
  challenge: Buffer,
  application: string,
  userName: string,
  userRole: string,
  hsmData: string,
): Promise<{
  u2f_register: Buffer,
  keyHandle: Buffer,
}> => {
  invariant(
    challenge.length === 32,
    "challenge hex is expected to have 32 bytes",
  );
  const applicationBuf = Buffer.from(application, "hex");
  invariant(
    applicationBuf.length === 32,
    "application hex is expected to have 32 bytes",
  );

  const userNameBuff = Buffer.from(userName);
  const hsmDataBuff = Buffer.from(hsmData, "hex");

  const keyHandleData = Buffer.concat([
    fromStringRoleToBytes[userRole.toLowerCase()],
    Buffer.from([userNameBuff.length]),
    userNameBuff,
    Buffer.from([hsmDataBuff.length]),
    hsmDataBuff,
  ]);

  const keyHandleDataLength = Buffer.alloc(2);
  keyHandleDataLength.writeUInt16BE(keyHandleData.length, 0);

  const data = Buffer.concat([
    challenge,
    applicationBuf,
    keyHandleDataLength,
    keyHandleData,
  ]);

  const response = await sendByChunk(transport, [0xe0, 0x01, 0x00, 0x00], data);

  let i = 0;
  const rfu = response.slice(i, (i += 1))[0];
  const pubKey = response.slice(i, (i += 65)).toString("hex");
  const keyHandleLength = response.slice(i, ++i)[0];
  const keyHandle = response.slice(i, (i += keyHandleLength));
  // const attestationSignature = lastResponse.slice(i, ++i)[0];
  // const signature = lastResponse.slice(i).toString("hex");
  return {
    u2f_register: removeStatus(response),
    keyHandle,
    rfu,
    pubKey,
  };
};
export const getPublicKey = async (
  transport: Transport<*>,
  path: number[],
  secp256k1: boolean = true,
): Promise<{
  pubKey: string,
  signature: string,
}> => {
  const data = Buffer.concat([
    Buffer.from([path.length]),
    ...path.map((derivation) => {
      const buf = Buffer.alloc(4);
      buf.writeUInt32BE(derivation, 0);
      return buf;
    }),
  ]);
  let curve = 0x01;
  if (!secp256k1) {
    curve = 0x02;
  }
  const response = await transport.send(0xe0, 0x40, curve, 0x00, data);
  const pubKeyLength = response.readInt8(0);
  const pubKey = response
    .slice(1, pubKeyLength + 1)
    .toString("hex")
    .toUpperCase();
  const signature = response.slice(
    pubKeyLength + 1,
    response.length - STATUS_LENGTH,
  );
  return { pubKey, signature };
};
export const authenticate = async (
  transport: Transport<*>,
  challenge: Buffer,
  application: string,
  keyHandle: Buffer,
  name: string,
  role: string,
  workspace: string,
): Promise<{
  userPresence: *,
  counter: *,
  signature: string,
  rawResponse: string,
}> => {
  invariant(
    challenge.length === 32,
    "challenge hex is expected to have 32 bytes",
  );
  const applicationBuf = Buffer.from(application, "hex");
  invariant(
    applicationBuf.length === 32,
    "application hex is expected to have 32 bytes",
  );
  const nameBuf = Buffer.from(name);
  const workspaceBuf = Buffer.from(workspace);

  const roleBuf = fromStringRoleToBytes[role.toLowerCase()];

  const keyHandleData = Buffer.concat([
    roleBuf,
    Buffer.from([nameBuf.length]),
    nameBuf,
    Buffer.from([workspaceBuf.length]),
    workspaceBuf,
  ]);

  const keyHandleDataLength = Buffer.alloc(2);
  keyHandleDataLength.writeUInt16BE(keyHandleData.length, 0);

  const data = Buffer.concat([
    challenge,
    applicationBuf,
    Buffer.from([keyHandle.length]),
    keyHandle,
    keyHandleDataLength,
    keyHandleData,
  ]);

  const response = await sendByChunk(transport, [0xe0, 0x02, 0x00, 0x00], data);

  const userPresence = response.slice(0, 1);
  const counter = response.slice(1, 5);
  const signature = response
    .slice(5, response.length - STATUS_LENGTH)
    .toString("hex");
  return {
    userPresence,
    counter,
    signature,
    rawResponse: removeStatus(response).toString("hex"),
  };
};
