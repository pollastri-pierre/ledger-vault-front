// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { FaCheck, FaChevronLeft } from "react-icons/fa";

import colors, { opacity } from "shared/colors";
import Box from "components/base/Box";
import { ModalClose, RichModalFooter } from "components/base/Modal";
import Button from "components/base/Button";
import Text from "components/base/Text";
import Absolute from "components/base/Absolute";

import type {
  MultiStepsFlowStep as MultiStepsFlowStepType,
  PayloadUpdater,
} from "./types";

type Props<T, P> = {
  initialPayload: T,
  Icon: React$ComponentType<*>,
  title: React$Node,
  steps: MultiStepsFlowStepType<T, P>[],
  additionalProps?: P,
  onClose: () => void,
  initialCursor?: number,
  isEditMode?: boolean,
  transitionTo?: string => void,
};

type State<T> = {
  cursor: number,
  payload: T,
};

class MultiStepsFlow<T, P> extends Component<Props<T, P>, State<T>> {
  state: State<T> = {
    cursor: this.props.initialCursor || 0,
    payload: this.props.initialPayload,
  };

  canPrev = () => this.state.cursor > 0;

  canNext = () => this.state.cursor < this.props.steps.length - 1;

  setCursor = (cursor: number) => {
    const { steps } = this.props;
    const step = steps[cursor];
    if (!step) return;
    this.transitionTo(step.id);
  };

  prev = () => this.setCursor(this.state.cursor - 1);

  next = async () => {
    const { steps, additionalProps } = this.props;
    const { payload, cursor } = this.state;
    const step = steps[cursor];
    const { onNext } = step;
    if (onNext) {
      try {
        await onNext(payload, this.updatePayload, additionalProps);
        this.setCursor(this.state.cursor + 1);
      } catch (err) {
        // FIXME handle that
        console.error(err);
      }
    } else {
      this.setCursor(this.state.cursor + 1);
    }
  };

  updatePayload: PayloadUpdater<T> = (patch, cb) =>
    this.setState(
      ({ payload }) => ({
        payload: { ...payload, ...patch },
      }),
      cb || undefined,
    );

  canTransitionTo = (stepId: string) => {
    const { steps, additionalProps } = this.props;
    const { payload } = this.state;
    const cursor = steps.findIndex(s => s.id === stepId);
    if (cursor === -1) return false;
    for (let i = 0; i <= cursor; i++) {
      const step = steps[i];
      if (step.requirements && !step.requirements(payload, additionalProps))
        return false;
    }
    return true;
  };

  transitionTo = (stepId: string) => {
    if (!this.canTransitionTo(stepId)) return;
    const { steps } = this.props;
    const cursor = steps.findIndex(s => s.id === stepId);
    if (cursor === -1) return;
    this.setState(() => ({ cursor }));
  };

  StepName: (MultiStepsFlowStepType<T, P>, number) => React$Node = (
    step,
    i,
  ) => {
    const { steps } = this.props;
    const { cursor } = this.state;
    const canTransition = this.canTransitionTo(step.id);
    const nextStep = steps[i + 1];
    const isActive = step.id === steps[cursor].id;
    const isValid = !!nextStep && this.canTransitionTo(nextStep.id);
    const isDisabled = isActive || !canTransition;
    const onClick = () => this.transitionTo(step.id);
    return (
      <StepName
        key={step.id}
        isActive={isActive}
        isDisabled={isDisabled}
        onClick={onClick}
      >
        <CheckOrNumber isSuccess={isValid} nb={i + 1} />
        <Text uppercase small>
          {step.name}
        </Text>
      </StepName>
    );
  };

  render() {
    const {
      steps,
      Icon,
      title,
      initialPayload,
      additionalProps,
      onClose,
    } = this.props;
    const { cursor, payload } = this.state;

    const step = steps[cursor];
    const prevStep = steps[cursor - 1] || null;
    const nextStep = steps[cursor + 1] || null;

    if (!step) return null;

    const { Step, Cta, nextLabel, prevLabel } = step;

    const stepProps = {
      payload,
      initialPayload,
      isEditMode: this.props.isEditMode,
      updatePayload: this.updatePayload,
      transitionTo: this.transitionTo,
      ...additionalProps,
    };

    return (
      <Box width={700} position="relative" style={styles.container}>
        <RichModalHeader
          onClose={onClose}
          Icon={Icon}
          title={title}
          steps={steps}
          renderStep={this.StepName}
        />
        <Box grow p={40} style={styles.content}>
          <Step {...stepProps} />
        </Box>
        <RichModalFooter>
          {prevStep && (
            <Absolute top={25} left={20}>
              <Button onClick={this.prev}>
                <Box horizontal flow={5} align="center" justify="center">
                  <FaChevronLeft />
                  <Text>
                    {prevLabel || <Trans i18nKey="multiStepsFlow:prevStep" />}
                  </Text>
                </Box>
              </Button>
            </Absolute>
          )}
          {nextStep && (
            <Absolute top={25} right={20}>
              <Button
                type="primary"
                onClick={this.next}
                disabled={!this.canTransitionTo(nextStep.id)}
              >
                {nextLabel || <Trans i18nKey="multiStepsFlow:nextStep" />}
              </Button>
            </Absolute>
          )}
          {Cta && (
            <Absolute top={15} right={20}>
              <Cta
                payload={payload}
                onClose={onClose}
                isEditMode={this.props.isEditMode}
                initialPayload={initialPayload}
                transitionTo={this.transitionTo}
                updatePayload={this.updatePayload}
                {...additionalProps}
              />
            </Absolute>
          )}
        </RichModalFooter>
      </Box>
    );
  }
}

const styles = {
  container: {
    minHeight: 620,
  },
  header: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    userSelect: "none",
  },
  footer: {
    height: 60,
  },
  content: {
    userSelect: "none",
  },
  checkOrNumber: {
    width: 10,
  },
};

type RichModalHeaderProps<T, P> = {
  title: React$Node,
  Icon: React$ComponentType<*>,
  steps?: MultiStepsFlowStepType<T, P>[],
  renderStep?: (MultiStepsFlowStepType<T, P>, number) => React$Node,
  onClose?: () => void,
};

export const RichModalHeader = <T, P>({
  title,
  Icon,
  steps,
  renderStep,
  onClose,
}: RichModalHeaderProps<T, P>) => (
  <>
    {onClose && <ModalClose onClick={onClose} />}
    <Box bg={colors.legacyLightGrey5} style={styles.header} p={40} flow={10}>
      <Box horizontal align="center" flow={10}>
        <Icon size={24} color={colors.legacyLightGrey7} />
        <Text large color={colors.textLight}>
          {title}
        </Text>
      </Box>
      {steps && steps.length && renderStep && (
        <Box horizontal flow={15}>
          {steps.map(renderStep)}
        </Box>
      )}
    </Box>
  </>
);

const checkSuccess = <FaCheck color={opacity(colors.green, 0.5)} />;

const CheckOrNumber = ({
  isSuccess,
  nb,
}: {
  isSuccess: boolean,
  nb: number,
}) => (
  <Box justify="center" align="center" style={styles.checkOrNumber}>
    {isSuccess ? (
      <Text lineHeight={0} small>
        {checkSuccess}
      </Text>
    ) : (
      <Text small>{`${nb}.`}</Text>
    )}
  </Box>
);

const StepName = styled(Box).attrs({
  horizontal: true,
  align: "center",
  flow: 5,
})`
  font-weight: ${p => (p.isActive ? "bold" : "normal")};
  color: ${p =>
    p.isActive
      ? colors.legacyDarkGrey3
      : p.isDisabled
      ? colors.lead
      : colors.legacyLightGrey3};
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};
  &:hover {
    cursor: pointer;
    color: ${colors.legacyDarkGrey3};
  }
`;

export default MultiStepsFlow;
