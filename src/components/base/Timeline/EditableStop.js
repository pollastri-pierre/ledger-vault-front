// @flow

import React, { useState, useRef } from "react";
import cloneDeep from "lodash/cloneDeep";
import { MdClear } from "react-icons/md";
import styled from "styled-components";

import {
  TimelineStop,
  ShadowStopInner,
  ShadowStopInnerTitle,
  useClickOther,
  useReadOnly,
} from "components/base/Timeline";
import colors from "shared/colors";
import Box from "components/base/Box";
import Button from "components/base/Button";
import type { EditableComponent, DisplayableComponent } from "./types";

type Props<T, P> = {
  label: React$Node,
  value: T,
  onSubmit: T => void,
  onRemove: () => void,
  onStartEdit?: () => void,
  onCancelEdit?: () => void,
  disableActions?: boolean,
  EditComponent: EditableComponent<T, P>,
  DisplayComponent: DisplayableComponent<T, P>,
  Icon: React$ComponentType<*>,
  extraProps?: P,
  isValid: T => boolean,
};

const EditableStop = <T, P>({
  label,
  value,
  EditComponent,
  DisplayComponent,
  extraProps,
  onSubmit,
  onRemove,
  onStartEdit,
  onCancelEdit,
  disableActions,
  isValid,
  Icon,
  ...props
}: Props<T, P>) => {
  const [isEdit, setEdit] = useState(false);
  const readOnly = useReadOnly();
  const handleSubmit = v => {
    setEdit(false);
    onSubmit(v);
  };
  const handleCancel = () => {
    onCancelEdit && onCancelEdit();
    setEdit(false);
  };
  const handleStartEdit = () => {
    onStartEdit && onStartEdit();
    setEdit(true);
  };
  const handleRemove = e => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <TimelineStop Icon={Icon} {...props}>
      {isEdit && (
        <EditForm
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isValid={isValid}
          label={label}
          EditComponent={EditComponent}
          extraProps={extraProps}
          initialValue={value}
        />
      )}
      <Container
        readOnly={readOnly}
        data-type="close-bubbles"
        onClick={readOnly ? undefined : handleStartEdit}
      >
        <Box grow>
          <DisplayComponent value={value} extraProps={extraProps} />
        </Box>
        <Actions>
          <Action onClick={handleRemove}>
            <MdClear size={16} />
          </Action>
        </Actions>
      </Container>
    </TimelineStop>
  );
};

export const EditForm = <T, P>({
  initialValue,
  onCancel,
  onSubmit,
  label,
  EditComponent,
  extraProps,
  isValid,
}: {
  initialValue: T,
  onCancel: () => void,
  onSubmit: T => void,
  label: React$Node,
  EditComponent: EditableComponent<T, P>,
  extraProps?: P,
  isValid: T => boolean,
}) => {
  const [value, setValue] = useState(cloneDeep(initialValue));
  const ref = useRef();

  useClickOther("close-bubbles", ref, onCancel);

  return (
    <ShadowStopInner ref={ref}>
      <ShadowStopInnerTitle onClose={onCancel}>{label}</ShadowStopInnerTitle>
      <EditComponent
        value={value}
        onChange={setValue}
        extraProps={extraProps}
      />
      <Box horizontal justify="space-between" flow={5} pt={20}>
        <Button
          type="link"
          variant="info"
          data-test="cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="filled"
          variant="primary"
          disabled={!isValid(value)}
          onClick={() => onSubmit(value)}
          data-test="approve_button"
        >
          {label}
        </Button>
      </Box>
    </ShadowStopInner>
  );
};

const Actions = styled(Box).attrs({
  horizontal: true,
  noShrink: true,
  ml: 10,
})``;

const Action = styled.div.attrs({ tabIndex: 0 })`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  opacity: 0.5;
  cursor: pointer;
  outline: none;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
    transform: scale(0.9);
  }
`;

const Container = styled(Box).attrs({
  grow: true,
  horizontal: true,
  align: "center",
})`
  background: white;
  min-height: 50px;
  margin: -10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px dashed transparent;
  ${Actions} {
    visibility: hidden;
    pointer-events: none;
  }
  ${p =>
    !p.readOnly
      ? `
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.02);
    border-color: ${colors.form.border};
    ${Actions} {
      visibility: visible;
      pointer-events: auto;
    }
  }
  &:active {
    background: rgba(0, 0, 0, 0.03);
  }
  `
      : ``}
`;

export default EditableStop;
