//@flow
import React from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";
import ApprovalSlider from "./ApprovalSlider.js";

const mapStateToProps = state => ({
  onboarding: state.onboarding
});
const mapDispatch = (dispatch: *) => ({
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type))
});
const AdministrationScheme = ({
  number,
  total,
  onChange,
  onboarding,
  onAddMessage,
  t
}: {
  number: number,
  total: number,
  onChange: Function,
  onAddMessage: Function,
  onboarding: Object,
  t: Translate
}) => {
  return (
    <div>
      <Title>{t("onboarding:administrators_scheme.title")}</Title>
      <Introduction>
        {t("onboarding:administrators_scheme.description")}
      </Introduction>
      <ApprovalSlider number={number} total={total} onChange={onChange} />
      <SubTitle>{t("onboarding:tocontinue")}</SubTitle>
      <ToContinue>
        {t("onboarding:administrators_scheme.to_continue")}
      </ToContinue>
      <Footer
        nextState
        render={onNext => {
          const onclick = async () => {
            try {
              onNext({ quorum: parseInt(number, 10) });
            } catch (e) {
              onAddMessage(
                "Error",
                "Oups something went wrong. Please retry",
                "error"
              );
            }
          };
          return (
            <DialogButton
              highlight
              onTouchTap={onclick}
              disabled={onboarding.quorum < 2}
            >
              {t("common:continue")}
            </DialogButton>
          );
        }}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(
  translate()(AdministrationScheme)
);
