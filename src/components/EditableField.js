// @flow

import React, { useState, useEffect } from "react";
import { FaRegEdit, FaCheck } from "react-icons/fa";

import { minWait } from "utils/promise";

import Text from "components/base/Text";
import Box from "components/base/Box";
import Button from "components/base/Button";
import { InputText, Form } from "components/base/form";

import colors from "shared/colors";

type Props = {
  value: string,
  onChange: Function,
  InputComponent?: React$ComponentType<*>,
  inputProps?: Object,
  getSaveDisabled?: string => boolean,
};
type RequestStatus = "idle" | "fetching" | "error" | "success";

const styles = {
  cursor: {
    cursor: "pointer",
  },
};

export default function EditableField(props: Props) {
  const {
    value,
    onChange,
    InputComponent,
    inputProps,
    getSaveDisabled,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");

  useEffect(() => {
    if (requestStatus === "success") {
      const messageTimer = setTimeout(() => {
        setRequestStatus("idle");
      }, 3000);
      return () => {
        clearTimeout(messageTimer);
      };
    }
  }, [requestStatus]);

  const handleChange = (value: string) => {
    setLocalValue(value);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const onClick = async () => {
    if (getSaveDisabled && getSaveDisabled(localValue)) return;
    if (localValue === "" || localValue === value) {
      setLocalValue(value);
      toggleEditMode();
    } else {
      setRequestStatus("fetching");
      try {
        await minWait(onChange(localValue), 500);
        setRequestStatus("success");
      } catch (e) {
        setLocalValue(value);
        setRequestStatus("idle");
      } finally {
        toggleEditMode();
      }
    }
  };
  const Input = InputComponent || InputText;
  return (
    <Box horizontal align="center" flow={10}>
      {!editMode ? (
        <>
          <Box flow={5} horizontal justify="center" align="center">
            {requestStatus === "success" && (
              <>
                <FaCheck color={colors.green} />
                <Text i18nKey="common:saved" color={colors.green} />
              </>
            )}
            <Text>{localValue}</Text>
          </Box>
          <FaRegEdit
            data-test="edit-icon"
            style={styles.cursor}
            color={colors.lead}
            size={12}
            onClick={toggleEditMode}
          />
        </>
      ) : (
        <Form onSubmit={onClick}>
          <Box horizontal align="center" flow={5}>
            <Input
              data-test="type-edit"
              autoFocus
              value={localValue}
              onChange={handleChange}
              disabled={requestStatus === "fetching"}
              {...inputProps}
            />
            {localValue === "" ? (
              <Button
                variant="info"
                data-test="cancel-button"
                onClick={toggleEditMode}
              >
                <Text i18nKey="common:cancel" />
              </Button>
            ) : (
              <Button
                type="filled"
                data-test="save-button"
                onClick={onClick}
                isLoadingProp={requestStatus === "fetching"}
                disabled={getSaveDisabled ? getSaveDisabled(localValue) : false}
              >
                <Text i18nKey="common:save" />
              </Button>
            )}
          </Box>
        </Form>
      )}
    </Box>
  );
}
