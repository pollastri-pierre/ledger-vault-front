// @flow

import React, { useState } from "react";
import moment from "moment";
import network from "network";
import omit from "lodash/omit";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FaDownload, FaCheck } from "react-icons/fa";
import type { ObjectParameters } from "query-string";

import colors, { opacity } from "shared/colors";

import TriggerErrorNotification from "components/TriggerErrorNotification";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Modal, {
  RichModalHeader,
  ModalBody,
  ModalFooter,
} from "components/base/Modal";
import FakeLink from "components/base/FakeLink";

const configByEntityType = {
  transaction: {
    endpoint: "/transactions",
    columns: [
      { name: "operationType", isEnabled: true },
      { name: "transactionNumber", isEnabled: true },
      { name: "status", isEnabled: true },
      { name: "family", isEnabled: true },
      { name: "parentName", isEnabled: true },
      { name: "currency", isEnabled: true },
      { name: "accountName", isEnabled: true },
      { name: "amount", isEnabled: true },
      { name: "amountUnit", isEnabled: true },
      { name: "fees", isEnabled: true },
      { name: "feesUnit", isEnabled: true },
      { name: "gasPrice", isEnabled: true },
      { name: "gasLimit", isEnabled: true },
      { name: "totalAmount", isEnabled: true },
      { name: "hash", isEnabled: true },
      { name: "sender", isEnabled: true },
      { name: "recipient", isEnabled: true },
      { name: "label", isEnabled: true },
      { name: "note", isEnabled: true },
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
  const [isModalOpened, setModalOpened] = useState(false);
  const [error, setError] = useState<?Error>(null);

  const config = configByEntityType[entityType];

  const [columns, setColumns] = useState(config.columns);

  const openModal = () => setModalOpened(true);
  const closeModal = () => setModalOpened(false);

  const onExport = async () => {
    const params = omit(queryParams, ["pageSize"]);
    const cols = columns.filter(c => c.isEnabled).map(c => c.name);
    const labels = cols.map(col => t(`exportCSV:columns.${entityType}:${col}`));
    try {
      const res = await network(
        `${config.endpoint}/export`,
        "POST",
        { columns: cols, params, labels },
        undefined,
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
    }
  };

  const toggleColumn = c => () =>
    setColumns(
      columns.map(col => {
        if (c.name === col.name) return { ...c, isEnabled: !c.isEnabled };
        return col;
      }),
    );

  return (
    <>
      {error && <TriggerErrorNotification error={error} />}
      <FakeLink onClick={openModal}>
        <Box horizontal align="center" flow={5}>
          <FaDownload />
          <span>Export to CSV</span>
        </Box>
      </FakeLink>
      <Modal isOpened={isModalOpened} onClose={closeModal}>
        <RichModalHeader
          onClose={closeModal}
          Icon={FaDownload}
          title="Export to CSV"
        />
        <ModalBody width={500} flow={20}>
          <div>Choose the columns you want to export:</div>
          <ColumnsList>
            {columns.map(c => (
              <Column
                key={c.name}
                isEnabled={c.isEnabled}
                onClick={toggleColumn(c)}
              >
                {t(`exportCSV:columns.${entityType}:${c.name}`)}
              </Column>
            ))}
          </ColumnsList>
        </ModalBody>
        <ModalFooter pb={20} mr={10}>
          <Button
            type="filled"
            variant="primary"
            data-test="export-to-csv"
            onClick={onExport}
          >
            Download
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

const ColumnsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -5px;
`;

const StyledColumn = styled.div`
  border-radius: 4px;
  padding: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  background: ${p =>
    p.isEnabled ? opacity(p.theme.colors.bLive, 0.1) : p.theme.colors.form.bg};
  color: ${p => (p.isEnabled ? p.theme.colors.blue : "inherit")};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

type ColumnProps = {
  onClick: () => void,
  children: React$Node,
  isEnabled: boolean,
};

const Column = ({ children, isEnabled, onClick }: ColumnProps) => {
  const color = isEnabled ? opacity(colors.blue, 0.3) : "rgba(0, 0, 0, 0.1)";
  return (
    <StyledColumn isEnabled={isEnabled} onClick={onClick}>
      <FaCheck color={color} />
      <span style={{ marginLeft: 5 }}>{children}</span>
    </StyledColumn>
  );
};
