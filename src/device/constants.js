// @flow

const all61xxStatus = [];
for (let i = 0x6100; i <= 0x61ff; i++) {
  all61xxStatus.push(i);
}

export const PAGINATED_STATUS = all61xxStatus;
export const U2F_PATH = [0x80564c54, 0x80553246];
export const CONFIDENTIALITY_PATH = [0x80564c54, 0x80434e46];
export const VALIDATION_PATH = [0x80564c54, 0x8056414c];
export const KEY_MATERIAL_PATH = [0x80564c54, 0x804b4559];
export const MATCHER_SESSION = 0x01;
export const ACCOUNT_MANAGER_SESSION = 0x02;
export const INIT_SESSION = 0x03;
export const U2F_TIMEOUT = "U2F_5";
export const STREAMING_RESPONSE = 0x02;
export const STREAMING_NEXT_ACTION = 0x01;
export const INVALID_DATA = 27264;
export const DEVICE_REJECT_ERROR_CODE = 27013;
export const INVALID_OR_MISSING_ATTESTATION = 0x6801;
export const APPID_VAULT_ADMINISTRATOR =
  "ad5be1a1fe011ce7f53ae081a22ae000a42021f3f94106a3bac9f76e8230e4b9";
