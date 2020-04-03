/* eslint-disable */
import { Observable } from "rxjs";

let _finalFirmInstallMock = null;
let _appInstallMock = null;

export const _setupInstallFinalFirmMock = fn => {
  _finalFirmInstallMock = fn;
};

export const _setupInstallAppMock = fn => {
  _appInstallMock = fn;
};

const install = (transport, type, extraParams) => {
  if (type === "firmware") {
    if (!_finalFirmInstallMock)
      throw new Error("final firm install is not mocked");
    return Observable.create(o => {
      _finalFirmInstallMock(o);
    });
  }
  if (type === "install-app") {
    if (!_appInstallMock) throw new Error("app install is not mocked");
    return Observable.create(o => {
      _appInstallMock(o);
    });
  }
};

export default { install };
