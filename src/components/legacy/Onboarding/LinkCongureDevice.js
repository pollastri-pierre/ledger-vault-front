// @flow
import React from "react";

const LinkCongureDevice = ({ children }: { children: * }) => (
  <a
    href="http://help.vault.ledger.com/administrator/Content/devices/ledgerblueenterprise.htm"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

export default LinkCongureDevice;
