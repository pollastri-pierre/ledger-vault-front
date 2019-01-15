// @flow
import React, { Component } from "react";
import MenuItem from "@material-ui/core/Menu";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import EnableForm from "components/EnableForm";
import InputTextWithUnity from "components/InputTextWithUnity";
import { addMessage } from "redux/modules/alerts";
import modals from "shared/modals";
import InfoModal from "../../InfoModal";
import { DialogButton } from "../..";

import type { StepProps } from "./AccountCreation";

const frequencies = [
  { title: "minute", key: 60 },
  { title: "hour", key: 3600 },
  { title: "day", key: 84600 }
];

const mapDispatchToProps = (dispatch: *) => ({
  onAddMessage: (title, content, type) =>
    dispatch(addMessage(title, content, type))
});

const styles = {
  base: {
    ...modals.base,
    width: 450
  },
  info: {
    margin: "20px 0px 40px 0px"
  }
};

type Props = StepProps & {
  classes: { [_: $Keys<typeof styles>]: string },
  onAddMessage: (t: string, m: string, ty: string) => void
};

type State = {
  rate_limiter: Object
};

class AccountCreationRateLimiter extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      rate_limiter: props.rate_limiter
    };
  }

  submit = () => {
    const { setRatelimiter, switchInternalModal, onAddMessage } = this.props;
    const { rate_limiter } = this.state;
    if (rate_limiter.enabled && rate_limiter.value === 0) {
      onAddMessage("Error", "Rate limiter value cannot be 0", "error");
      return false;
    }
    setRatelimiter(this.state.rate_limiter);
    switchInternalModal("main");
  };

  onChangeValue = val => {
    const isNumber = /^[0-9\b]+$/;

    if (val === "" || isNumber.test(val)) {
      this.setState(state => ({
        rate_limiter: {
          ...state.rate_limiter,
          value: parseInt(val, 10) || 0
        }
      }));
    }
  };

  onToggle = () => {
    this.setState(state => ({
      rate_limiter: {
        ...state.rate_limiter,
        enabled: !state.rate_limiter.enabled
      }
    }));
  };

  changeFrequency = (e: *) => {
    this.setState(state => ({
      rate_limiter: {
        ...state.rate_limiter,
        frequency: e.target.value
      }
    }));
  };

  cancel = () => {
    this.props.switchInternalModal("main");
  };

  render() {
    const { rate_limiter } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.base}>
        <header>
          <h2>Rate Limiter</h2>
        </header>
        <div className="content">
          <EnableForm checked={rate_limiter.enabled} toggle={this.onToggle}>
            <InputTextWithUnity
              label="Rate"
              hasError={rate_limiter.value === 0 && rate_limiter.enabled}
              field={
                <input
                  type="text"
                  id="text-duration"
                  value={rate_limiter.value}
                  onChange={e => this.onChangeValue(e.target.value)}
                />
              }
            >
              <Select
                value={rate_limiter.frequency}
                onChange={this.changeFrequency}
                disableUnderline
                renderValue={key =>
                  `per ${(frequencies.find(o => o.key === key) || {}).title}`
                }
              >
                {frequencies.map(({ title, key }) => (
                  <MenuItem
                    disableRipple
                    key={key}
                    value={key}
                    style={{ color: "#27d0e2" }}
                  >
                    <span style={{ color: "black" }}>{title}</span>
                  </MenuItem>
                ))}
              </Select>
            </InputTextWithUnity>
            <InfoModal className={classes.info}>
              Rate-limiter enforces that your team does not exceed a pre-defined
              number of outgoing transaction per interval of time.
            </InfoModal>
          </EnableForm>
        </div>

        <div className="footer">
          <DialogButton onTouchTap={this.cancel}>Cancel</DialogButton>
          <DialogButton right highlight onTouchTap={this.submit}>
            Done
          </DialogButton>
        </div>
      </div>
    );
  }
}
export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(AccountCreationRateLimiter));
