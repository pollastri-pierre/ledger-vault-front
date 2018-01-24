//@flow
import React from "react";
import Trash from "components/icons/thin/Trash.js";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import RecoverySheet from "components/icons/thin/RecoverySheet";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "../../components/Onboarding.js";
import { withStyles } from "material-ui/styles";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";

const step = {
  base: { fontSize: 11, lineHeight: 1.82, flex: 0.3 },
  number: { fontSize: 16, marginRight: 10, verticalAlign: "bottom" }
};
const Step = withStyles(step)(({ number, icon, children, classes }) => {
  return (
    <div className={classes.base}>
      <div style={{ marginBottom: 13 }}>
        <span className={classes.number}>{number}.</span>
        {icon}
      </div>
      {children}
    </div>
  );
});
const styles = {
  steps: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20
  },
  careful: {
    color: "#ea2e49",
    fontSize: 13,
    lineHeight: 1.54,
    margin: 0,
    marginBottom: 30
  }
};
const Backup = ({
  classes
}: {
  classes: { [$Keys<typeof styles>]: string }
}) => {
  return (
    <div>
      <Title>Backup</Title>
      <Introduction>
        To secure your company’s master seed, it is very important to backup the
        3 sets of 24 words of each Ledger Blue device that was configured
        previously.{" "}
        <strong>
          Take all the Ledger Cryptosteel backups from the briefcase and ask
          each shared owner to secure their recovery phrase.
        </strong>
      </Introduction>
      <div className={classes.steps}>
        <Step
          number="1"
          icon={<RecoverySheet style={{ height: 32, width: 22 }} />}
        >
          Grab your recovery sheet
        </Step>
        <Step
          number="2"
          icon={<Cryptosteel style={{ height: 31, width: 32 }} />}
        >
          Setup your Ledger Cryptosteel
        </Step>
        <Step
          number="3"
          icon={<Trash color="#cccccc" style={{ height: 28 }} />}
        >
          Destroy your recovery sheet
        </Step>
      </div>
      <div className={classes.careful}>
        Do not destroy your recovery sheet until it is perfectly secured in a
        Ledger Cryptosteel (double check each of the 24 words).
      </div>
      <SubTitle>To Continue</SubTitle>
      <ToContinue>
        Make sure all shared owners have backed up their recovery phrase in the
        Ledger Cryptosteel and that all paper recovery sheets are destroyed.
      </ToContinue>
      <Footer
        render={(onPrev, onNext) => (
          <DialogButton highlight onTouchTap={onNext}>
            Continue
          </DialogButton>
        )}
      />
    </div>
  );
};

export default withStyles(styles)(Backup);
