//@flow
import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import { addMessage } from "redux/modules/alerts";
import Footer from "./Footer";
import ApprovalSlider from "./ApprovalSlider.js";

const styles = {
  disabled: {
    opacity: 0.3,
    pointerEvents: "none"
  }
};
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
  classes,
  is_editable,
  onboarding,
  onAddMessage,
  t
}: {
  number: number,
  total: number,
  onChange: Function,
  onAddMessage: Function,
  classes: { [$Keys<typeof styles>]: string },
  onboarding: Object,
  is_editable: boolean,
  t: Translate
}) => {
  return (
    <div>
      <Title>{t("onboarding:administrators_scheme.title")}</Title>
      <div className={cx({ [classes.disabled]: !is_editable })}>
        <Introduction>
          {t("onboarding:administrators_scheme.description")}
        </Introduction>
        <ApprovalSlider number={number} total={total} onChange={onChange} />
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
  withStyles(styles)(translate()(AdministrationScheme))
);
