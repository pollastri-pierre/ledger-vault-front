//@flow
import React from "react";
import { connect } from "react-redux";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";
import ApprovalSlider from "./ApprovalSlider.js";

const mapStateToProps = state => ({
  onboarding: state.onboarding
});
const mapDispatch = () => ({});
const AdministrationScheme = ({
  number,
  total,
  onChange,
  onboarding
}: {
  number: number,
  total: number,
  onChange: Function,
  onboarding: Object
}) => {
  return (
    <div>
      <Title>Administration scheme</Title>
      <Introduction>
        This step lets you specify the administration scheme of your company. It
        defines the number of approvals to collect from all registered
        administrators to allow sensitive actions.
      </Introduction>
      <ApprovalSlider number={number} total={total} onChange={onChange} />
      <SubTitle>To continue</SubTitle>
      <ToContinue>
        Make sure to define an administration scheme that your team will be able
        to satisfy. Ledger Vault allows you to require less approvals than the
        number of administrators in your team.
      </ToContinue>
      <Footer
        render={(onPrev, onNext) => (
          <DialogButton
            highlight
            onTouchTap={onNext}
            disabled={onboarding.nbRequired < 3}
          >
            Continue
          </DialogButton>
        )}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(AdministrationScheme);
