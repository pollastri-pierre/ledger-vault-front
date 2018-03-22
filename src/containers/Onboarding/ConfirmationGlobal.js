//@flow
import React from "react";
import { Title } from "components/Onboarding";
import { withStyles } from "material-ui/styles";
import Validate from "components/icons/Validate";
import People from "components/icons/thin/People.js";
import Lock from "components/icons/thin/Lock";
import DialogButton from "components/buttons/DialogButton";
import SpinnerCard from "components/spinners/SpinnerCard";
import { connect } from "react-redux";
import Footer from "./Footer";

const styles = {
  base: {
    textAlign: "center",
    fontSize: 13
  },
  icon: {
    width: 35,
    height: 35,
    margin: "0 auto 20px",
    borderRadius: "50%",
    border: "3px solid #27d0e2",
    paddingTop: 5,
    textAlign: "center"
  },
  sep: {
    width: 170,
    height: 1,
    background: "#eeeeee",
    margin: "30px auto 30px auto"
  },
  sumary: {
    display: "flex",
    width: 300,
    margin: "auto"
  },
  info: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 1.82
  }
};
const ConfirmationGlobal = ({
  classes,
  onboarding
}: {
  classes: { [$Keys<typeof styles>]: string },
  onboarding: *
}) => {
  return (
    <div>
      <Title>Confirmation</Title>
      {onboarding.successSeedShards ? (
        <div>
          <div className={classes.base}>
            <div>
              <div className={classes.icon}>
                <Validate color="#27d0e2" style={{ strokeWidth: 4 }} />
              </div>
            </div>
            <strong>Your team’s Ledger Vault is now configured.</strong>
            <p>Team members are now able to sign-in.</p>
          </div>
          <div className={classes.sep} />
          <div className={classes.sumary}>
            <div className={classes.info}>
              <div style={{ marginBottom: 12 }}>
                <People color="#cccccc" style={{ height: 29 }} />
              </div>
              3 shared owners
            </div>
            <div className={classes.info}>
              <div style={{ marginBottom: 12 }}>
                <People color="#cccccc" style={{ height: 29 }} />
              </div>
              {onboarding.members.length} team members
            </div>
            <div className={classes.info}>
              <div style={{ marginBottom: 12 }}>
                <Lock />
              </div>
              {onboarding.nbRequired}/{onboarding.members.length} administration
              scheme
            </div>
          </div>
        </div>
      ) : (
        <SpinnerCard />
      )}
      <Footer
        isBack={false}
        render={(onPrev, onNext) => (
          <DialogButton highlight onTouchTap={onNext}>
            Continue
          </DialogButton>
        )}
      />
    </div>
  );
};

const mapProps = state => ({
  onboarding: state.onboarding
});

export default connect(mapProps, () => ({}))(
  withStyles(styles)(ConfirmationGlobal)
);
