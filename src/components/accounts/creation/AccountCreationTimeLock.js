//@flow
import InfoModal from "../../InfoModal";
import React, { Component } from "react";
import { DialogButton } from "../../";
import EnableForm from "components/EnableForm";
import { connect } from "react-redux";
import InputTextWithUnity from "components/InputTextWithUnity";
import { addMessage } from "redux/modules/alerts";
import { withStyles } from "material-ui/styles";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import modals from "shared/modals";

const mapDispatchToProps = dispatch => ({
  onAddMessage: (title, content, type) =>
    dispatch(addMessage(title, content, type))
});

const styles = {
  base: {
    ...modals.base,
    width: 440
  },
  info: {
    margin: "20px 0px 40px 0px"
  }
};

type Props = {
  switchInternalModal: Function,
  timelock: Object,
  setTimelock: Function,
  classes: { [_: $Keys<typeof styles>]: string },
  onAddMessage: (t: string, m: string, ty: string) => void
};

type State = {
  timelock: Object
};

const frequencies = [
  { title: "minutes", key: 60 },
  { title: "hours", key: 3600 },
  { title: "days", key: 84600 }
];

class AccountCreationTimeLock extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      timelock: props.timelock
    };
  }
  submit = () => {
    const { setTimelock, switchInternalModal, onAddMessage } = this.props;
    const { timelock } = this.state;
    if (timelock.enabled && timelock.value === 0) {
      onAddMessage("Error", "Timelock value cannot be 0", "error");
      return false;
    } else {
      setTimelock(this.state.timelock);
      switchInternalModal("main");
    }
  };

  onChangeValue = val => {
    const isNumber = /^[0-9\b]+$/;

    if (val === "" || isNumber.test(val)) {
      this.setState({
        ...this.state,
        timelock: { ...this.state.timelock, value: parseInt(val, 10) || 0 }
      });
    }
  };

  onToggle = () => {
    this.setState({
      ...this.state,
      timelock: {
        ...this.state.timelock,
        enabled: !this.state.timelock.enabled
      }
    });
  };

  changeFrequency = (e: *) => {
    this.setState({
      ...this.state,
      timelock: {
        ...this.state.timelock,
        frequency: e.target.value
      }
    });
  };

  cancel = () => {
    this.props.switchInternalModal("main");
  };

  render() {
    const { timelock } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.base}>
        <header>
          <h2>Time-lock</h2>
        </header>
        <div className="content">
          <EnableForm checked={timelock.enabled} toggle={this.onToggle}>
            <InputTextWithUnity
              hasError={timelock.value === 0 && timelock.enabled}
              label="Duration"
              field={
                <input
                  type="text"
                  id="text-duration"
                  value={timelock.value}
                  onChange={e => this.onChangeValue(e.target.value)}
                />
              }
            >
              <Select
                value={timelock.frequency}
                onChange={this.changeFrequency}
                disableUnderline
                renderValue={key =>
                  (frequencies.find(o => o.key === key) || {}).title}
              >
                {frequencies.map(({ title, key }) => (
                  <MenuItem
                    style={{ color: "#27d0e2" }}
                    disableRipple
                    key={key}
                    value={key}
                  >
                    <span style={{ color: "black" }}>{title}</span>
                  </MenuItem>
                ))}
              </Select>
            </InputTextWithUnity>
            <InfoModal className={classes.info}>
              Time-lock delays each outgoing operation by a configurable length,
              after all the required members have given their approvals.
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

export default connect(undefined, mapDispatchToProps)(
  withStyles(styles)(AccountCreationTimeLock)
);
