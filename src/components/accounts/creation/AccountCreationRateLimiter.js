//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import Checkbox from "../../form/Checkbox";
import { PopBubble, DialogButton } from "../../";
import EnableForm from "../../../components/EnableForm";
import InfoModal from "../../InfoModal";
import ArrowDown from "../../icons/ArrowDown";
import { addMessage } from "../../../redux/modules/alerts";

const mapDispatchToProps = dispatch => ({
  onAddMessage: (title, content, type) =>
    dispatch(addMessage(title, content, type))
});

type Props = {
  setRatelimiter: Function,
  switchInternalModal: string => void,
  ratelimiter: Object,
  onAddMessage: (t: string, m: string, ty: string) => void
};

type State = {
  rate_limiter: Object,
  popover: boolean,
  anchor?: Object
};

class AccountCreationRateLimiter extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      rate_limiter: props.rate_limiter,
      popover: false,
      anchor: document.getElementsByClassName("count")[0]
    };
  }

  submit = () => {
    const { setRatelimiter, switchInternalModal, onAddMessage } = this.props;
    const { rate_limiter } = this.state;
    if (rate_limiter.enabled && rate_limiter.value === 0) {
      onAddMessage("Error", "Rate limiter value cannot be 0", "error");
      return false;
    } else {
      setRatelimiter(this.state.rate_limiter);
      switchInternalModal("main");
    }
  };

  onChangeValue = val => {
    const isNumber = /^[0-9\b]+$/;

    if (val === "" || isNumber.test(val)) {
      this.setState({
        ...this.state,
        rate_limiter: {
          ...this.state.rate_limiter,
          value: parseInt(val, 10) || 0
        }
      });
    }
  };

  onToggle = () => {
    this.setState({
      ...this.state,
      rate_limiter: {
        ...this.state.rate_limiter,
        enabled: !this.state.rate_limiter.enabled
      }
    });
  };

  openFrequency = target => {
    this.setState({
      ...this.state,
      popover: !this.state.popover,
      anchor: document.getElementsByClassName("arrow-down")[0]
    });
  };

  changeFrequency = val => {
    this.setState({
      ...this.state,
      rate_limiter: {
        ...this.state.rate_limiter,
        frequency: val
      }
    });
  };

  cancel = () => {
    this.props.switchInternalModal("main");
  };
  render() {
    const { switchInternalModal, onAddMessage, setRatelimiter } = this.props;

    const { rate_limiter, popover } = this.state;
    return (
      <div className="small-modal">
        <header>
          <h3>Rate Limiter</h3>
        </header>
        <div className="content">
          <EnableForm checked={rate_limiter.enabled} toggle={this.onToggle}>
            <div className="form-field">
              <input
                className={`medium-padding ${rate_limiter.value === 0
                  ? "error"
                  : ""}`}
                type="text"
                id="text-duration"
                value={rate_limiter.value}
                onChange={e => this.onChangeValue(e.target.value)}
              />
              <label htmlFor="text-duration">Rate</label>
              <span
                className="count dropdown"
                role="button"
                tabIndex={0}
                onClick={e => this.openFrequency(e.currentTarget)}
              >
                <strong>operations</strong> per {rate_limiter.frequency.label}
                <ArrowDown className="arrow-down" />
              </span>
              <PopBubble
                open={popover}
                onRequestClose={this.openFrequency}
                anchorEl={this.state.anchor}
                style={{
                  marginLeft: "34px",
                  marginTop: "11px"
                }}
              >
                <div className="frequency-bubble">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      this.changeFrequency({
                        value: 60,
                        label: "minute"
                      })}
                    className={`frequency-bubble-row ${rate_limiter.frequency
                      .value === 60
                      ? "active"
                      : ""}`}
                  >
                    minute
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      this.changeFrequency({
                        value: 3600,
                        label: "hour"
                      })}
                    className={`frequency-bubble-row ${rate_limiter.frequency
                      .value === 3600
                      ? "active"
                      : ""}`}
                  >
                    hour
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      this.changeFrequency({
                        value: 84600,
                        label: "day"
                      })}
                    className={`frequency-bubble-row ${rate_limiter.frequency
                      .value === 84600
                      ? "active"
                      : ""}`}
                  >
                    day
                  </div>
                </div>
              </PopBubble>
            </div>
            <InfoModal>
              Rate-limiter enforces that your team does not exceed a pre-defined
              number of outgoing transaction per interval of time.
            </InfoModal>
          </EnableForm>
        </div>

        <div className="footer">
          <DialogButton className="cancel" highlight onTouchTap={this.cancel}>
            Cancel
          </DialogButton>
          <DialogButton right highlight onTouchTap={this.submit}>
            Done
          </DialogButton>
        </div>
      </div>
    );
  }
}
export default connect(undefined, mapDispatchToProps)(
  AccountCreationRateLimiter
);
