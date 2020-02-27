// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import type { Translate } from "data/types";
import { Title, Introduction } from "components/Onboarding";
import Disabled from "components/Disabled";
import DialogButton from "components/legacy/DialogButton";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";
import ApprovalSlider from "./ApprovalSlider";

const mapStateToProps = state => ({
  onboarding: state.onboarding,
});
const mapDispatch = (dispatch: *) => ({
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type)),
});

const AdministrationScheme = ({
  number,
  total,
  onChange,
  is_editable,
  onboarding,
  onAddMessage,
  t,
}: {
  number: number,
  total: number,
  onChange: Function,
  onAddMessage: Function,
  onboarding: Object,
  is_editable: boolean,
  t: Translate,
}) => (
  <div>
    <Title>{t("onboarding:administrators_scheme.title")}</Title>
    <Disabled disabled={!is_editable}>
      <Introduction>
        {t("onboarding:administrators_scheme.description")}
      </Introduction>
      <ApprovalSlider
        number={number}
        total={total}
        onChange={onChange}
        max={total - 1}
        min={2}
      />
    </Disabled>
    <Footer
      nextState
      render={(onNext, onPrevious) => {
        const onclick = async () => {
          try {
            return await onNext({ quorum: parseInt(number, 10) });
          } catch (e) {
            onAddMessage(
              "Error",
              "Oops something went wrong. Please try again",
              "error",
            );
          }
        };
        return (
          <>
            <DialogButton onTouchTap={onPrevious}>
              {t("common:back")}
            </DialogButton>
            <DialogButton
              highlight
              onTouchTap={onclick}
              disabled={onboarding.quorum < 2 || onboarding.quorum === total}
            >
              {t("common:continue")}
            </DialogButton>
          </>
        );
      }}
    />
  </div>
);
export default connect(
  mapStateToProps,
  mapDispatch,
)(withTranslation()(AdministrationScheme));
