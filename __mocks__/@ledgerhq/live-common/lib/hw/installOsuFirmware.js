import { Observable } from "rxjs";

let _osuFirmInstallMock = null;

export const _setupInstallOsuFirmMock = fn => {
  _osuFirmInstallMock = fn;
};

export default () => {
  if (!_osuFirmInstallMock) throw new Error("osu firm install is not mocked");
  return Observable.create(o => {
    _osuFirmInstallMock(o);
  });
};
