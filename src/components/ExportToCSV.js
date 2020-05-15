// @flow

import React, { useState } from "react";
import moment from "moment";
import network from "network";
import omit from "lodash/omit";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import type { ObjectParameters } from "query-string";

import TriggerErrorNotification from "components/TriggerErrorNotification";
import Disabled from "components/Disabled";
import Box from "components/base/Box";
import FakeLink from "components/base/FakeLink";

const configByEntityType = {
  transaction: {
    endpoint: "/transactions",
    columns: [
      "createdOn",
      "broadcastOn",
      "operationType",
      "transactionNumber",
      "status",
      "parentName",
      "currency",
      "accountName",
      "amount",
      "amountUnit",
      "fees",
      "feesUnit",
      "gasPrice",
      "gasLimit",
      "totalAmount",
      "hash",
      "sender",
      "recipient",
      "label",
      "note",
    ],
  },
};

export type ExportEntityType = $Keys<typeof configByEntityType>;

type Props = {
  queryParams: ObjectParameters,
  entityType: ExportEntityType,
};

export default function ExportToCSV(props: Props) {
  const { queryParams, entityType } = props;
  const { t } = useTranslation();
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<?Error>(null);

  const config = configByEntityType[entityType];

  const onExport = async () => {
    const params = omit(queryParams, ["pageSize"]);
    const labels = config.columns.map((col) =>
      t(`exportCSV:columns.${entityType}:${col}`),
    );
    try {
      setPending(true);
      const res = await network(
        `${config.endpoint}/export`,
        "POST",
        { columns: config.columns, params, labels },
        { noParse: true },
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${moment().format("YYYYMMDD")}_ledger_vault_workspace.csv`;
      document.body && document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {error && <TriggerErrorNotification error={error} />}
      <Disabled disabled={isPending}>
        <FakeLink onClick={onExport}>
          <Box horizontal align="center" flow={5}>
            <FaDownload />
            <span>{isPending ? "Exporting..." : "Export to CSV"}</span>
          </Box>
        </FakeLink>
      </Disabled>
    </>
  );
}
