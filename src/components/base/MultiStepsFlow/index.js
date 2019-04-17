// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";

import colors, { opacity } from "shared/colors";
import Box from "components/base/Box";
import { ModalFooterButton, ModalClose } from "components/base/Modal";
import Text from "components/base/Text";

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
  isNextLoading: boolean,
};

class MultiStepsFlow<T, P> extends Component<Props<T, P>, State<T>> {
  state: State<T> = {
    cursor: this.props.initialCursor || 0,
    payload: this.props.initialPayload,
    isNextLoading: false,
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
        this.setState(() => ({ isNextLoading: true }));
        await onNext(payload, this.updatePayload, additionalProps);
        this.setCursor(this.state.cursor + 1);
      } catch (err) {
        // FIXME handle that
        console.error(err);
      } finally {
        this.setState(() => ({ isNextLoading: false }));
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
    const { steps } = this.props;
    const { payload } = this.state;
    const cursor = steps.findIndex(s => s.id === stepId);
    if (cursor === -1) return false;
    for (let i = 0; i <= cursor; i++) {
      const step = steps[i];
      if (step.requirements && !step.requirements(payload)) return false;
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
      ...props
    } = this.props;
    const { cursor, payload, isNextLoading } = this.state;

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
      <Box width={700} position="relative" {...props}>
        {onClose && <ModalClose onClick={onClose} />}
        <Box bg="#f5f5f5" style={styles.header} p={40} flow={10}>
          <Box horizontal align="center" flow={10}>
            <Icon size={24} color="#ddd" />
            <Text large color="#aaa">
              {title}
            </Text>
          </Box>
          <Box horizontal flow={15}>
            {steps.map(this.StepName)}
          </Box>
        </Box>
        <Box grow p={40} style={styles.content}>
          <Step {...stepProps} />
        </Box>
        <Box horizontal px={10} position="relative" style={styles.footer}>
          {prevStep && (
            <FooterButton onClick={this.prev} left color={colors.lead}>
              <FaArrowLeft style={{ marginRight: 10 }} />
              {prevLabel || <Trans i18nKey="multiStepsFlow:prevStep" />}
            </FooterButton>
          )}
          {nextStep && (
            <FooterButton
              onClick={this.next}
              right
              isDisabled={!this.canTransitionTo(nextStep.id)}
              color={colors.ocean}
              isLoading={isNextLoading}
            >
              {nextLabel || <Trans i18nKey="multiStepsFlow:nextStep" />}
              <FaArrowRight style={{ marginLeft: 10 }} />
            </FooterButton>
          )}
          {Cta && (
            <CtaContainer>
              <Cta
                payload={payload}
                onClose={onClose}
                isEditMode={this.props.isEditMode}
                initialPayload={initialPayload}
                transitionTo={this.transitionTo}
                updatePayload={this.updatePayload}
              />
            </CtaContainer>
          )}
        </Box>
      </Box>
    );
  }
}

const styles = {
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
  color: ${p => (p.isActive ? "#555" : p.isDisabled ? "#999" : "#777")};
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};
  &:hover {
    cursor: pointer;
    color: #555;
  }
`;

const FooterButton = styled(ModalFooterButton)`
  position: absolute;
  left: ${p => (p.left ? "15px" : "auto")};
  right: ${p => (p.right ? "15px" : "auto")};
`;

const CtaContainer = styled.div`
  position: absolute;
  right: 20px;
  bottom: 0;
`;

export default MultiStepsFlow;
