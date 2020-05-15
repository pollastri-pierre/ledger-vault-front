// @flow
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { nextState, previousState } from "redux/modules/onboarding";

const mapDispatchToProps = (dispatch: *) => ({
  onNextState: (data) => dispatch(nextState(data)),
  onPreviousState: (data) => dispatch(previousState(data)),
});

const mapStateToProps = (state) => ({
  step: state.onboarding.currentStep,
});

const Footer = ({
  onNextState,
  onPreviousState,
  render,
}: {
  onNextState: Function,
  onPreviousState: Function,
  render: Function,
}) => <FooterContainer>{render(onNextState, onPreviousState)}</FooterContainer>;

const FooterContainer = styled.div`
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
