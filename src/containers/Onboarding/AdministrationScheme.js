//@flow
import React, { Fragment } from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Title, Introduction } from "components/Onboarding";
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
      <Footer
        nextState
        render={(onNext, onPrevious) => {
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
            <Fragment>
              <DialogButton onTouchTap={onPrevious}>
                {t("common:back")}
              </DialogButton>
              <DialogButton
                highlight
                onTouchTap={onclick}
                disabled={onboarding.quorum < 2}
              >
                {t("common:continue")}
              </DialogButton>
            </Fragment>
          );
        }}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(
  translate()(AdministrationScheme)
);
