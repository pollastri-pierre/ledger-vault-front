// @flow
import React from "react";

const LinkCongureDevice = ({ children }: { children: * }) => (
  <a
    href="https://help.vault.ledger.com/Content/devices/dev_psd.html"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

export default LinkCongureDevice;
