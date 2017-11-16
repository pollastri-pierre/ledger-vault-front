//@flow
import React from "react";
import Checkbox from "../../form/Checkbox";
import { PopBubble, DialogButton } from "../../";
import ArrowDown from "../../icons/ArrowDown";

function AccountCreationTimeLock(props: {
  switchInternalModal: Function,
  timelock: Object,
  popbubble: boolean,
  anchor?: Object,
  enable: Function,
  openPopBubble: Function,
  change: Function,
  changeFrequency: Function
}) {
  const {
    switchInternalModal,
    timelock,
    enable,
    popbubble,
    openPopBubble,
    anchor,
    change,
    changeFrequency
  } = props;

  return (
    <div className="small-modal">
      <header>
        <h3>Time-lock</h3>
      </header>
      <div className="content">
        <div
          className="form-field-checkbox"
          onClick={enable}
          role="button"
          tabIndex={0}
        >
          <label htmlFor="enable-timelock">Enable</label>
          <Checkbox
            checked={timelock.enabled}
            handleInputChange={enable}
            labelFor="enable-timelock"
          />
        </div>
        <div className="form-field">
          <input
            className="small-padding"
            type="text"
            id="text-duration"
            value={timelock.value}
            onChange={e => change(e.target.value)}
          />
          <label htmlFor="text-duration">Duration</label>
          <span
            className="count dropdown"
            role="button"
            tabIndex={0}
            onClick={e => openPopBubble(e.currentTarget)}
          >
            {timelock.frequency.label}
            <ArrowDown className="arrow-down" />
          </span>
          <PopBubble
            open={popbubble}
            onRequestClose={openPopBubble}
            anchorEl={anchor}
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
                  changeFrequency("timelock", { label: "minuts", value: 60 })}
                className={`frequency-bubble-row ${timelock.frequency.label ===
                "minuts"
                  ? "active"
                  : ""}`}
              >
                minuts
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  changeFrequency("timelock", { label: "hours", value: 3600 })}
                className={`frequency-bubble-row ${timelock.frequency.label ===
                "hours"
                  ? "active"
                  : ""}`}
              >
                hours
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  changeFrequency("timelock", { label: "days", value: 84600 })}
                className={`frequency-bubble-row ${timelock.frequency.label ===
                "days"
                  ? "active"
                  : ""}`}
              >
                days
              </div>
            </div>
          </PopBubble>
        </div>
        <p className="info">
          Time-lock delays each outgoing operation by a configurable length,
          after all the required members have given their approvals.
        </p>
      </div>

      <div className="footer">
        <DialogButton
          right
          highlight
          onTouchTap={() => switchInternalModal("main")}
        >
          Done
        </DialogButton>
      </div>
    </div>
  );
}

export default AccountCreationTimeLock;
