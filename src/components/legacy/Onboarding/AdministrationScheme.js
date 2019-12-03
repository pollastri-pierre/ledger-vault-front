// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/legacy/DialogButton";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";
import ApprovalSlider from "./ApprovalSlider";

const styles = {
  disabled: {
    opacity: 0.3,
    pointerEvents: "none",
  },
};
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
  classes,
  is_editable,
  onboarding,
  onAddMessage,
  t,
}: {
  number: number,
  total: number,
  onChange: Function,
  onAddMessage: Function,
  classes: { [$Keys<typeof styles>]: string },
  onboarding: Object,
  is_editable: boolean,
  t: Translate,
}) => (
  <div>
    <Title>{t("onboarding:administrators_scheme.title")}</Title>
    <div className={cx({ [classes.disabled]: !is_editable })}>
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
    </div>
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
)(withStyles(styles)(withTranslation()(AdministrationScheme)));
