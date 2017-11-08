//@flow
import React from "react";
import Checkbox from "../../form/Checkbox";
import { PopBubble, DialogButton } from "../../";
import InfoModal from "../../InfoModal";
import ArrowDown from "../../icons/ArrowDown";

type Props = {
  rate_limiter: *,
  popbubble: boolean,
  anchor?: boolean,
  anchor: React.DOM,
  enable: () => Function,
  switchInternalModal: string => Function,
  changeFrequency: (a: string, b: string) => Function,
  openPopBubble: (*) => Function,
  change: (a: string) => Function
};

function AccountCreationRateLimiter(props: Props) {
  const {
    switchInternalModal,
    rate_limiter,
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
        <h3>Rate Limiter</h3>
      </header>
      <div className="content">
        <div
          className="form-field-checkbox"
          onClick={enable}
          role="button"
          tabIndex={0}
        >
          <label htmlFor="enable-ratelimiter">Enable</label>
          <Checkbox
            checked={rate_limiter.enabled}
            handleInputChange={enable}
            labelFor="enable-ratelimiter"
          />
        </div>
        <div className="form-field">
          <input
            className="medium-padding"
            type="text"
            id="text-duration"
            value={rate_limiter.value}
            onChange={e => change(e.target.value)}
          />
          <label htmlFor="text-duration">Rate</label>
          <span
            className="count dropdown"
            role="button"
            tabIndex={0}
            onClick={e => openPopBubble(e.currentTarget)}
          >
            <strong>operation</strong> per {rate_limiter.frequency}
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
                onClick={() => changeFrequency("rate-limiter", "minut")}
                className={`frequency-bubble-row ${rate_limiter.frequency ===
                "minut"
                  ? "active"
                  : ""}`}
              >
                minut
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => changeFrequency("rate-limiter", "hour")}
                className={`frequency-bubble-row ${rate_limiter.frequency ===
                "hour"
                  ? "active"
                  : ""}`}
              >
                hour
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => changeFrequency("rate-limiter", "day")}
                className={`frequency-bubble-row ${rate_limiter.frequency ===
                "day"
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

export default AccountCreationRateLimiter;
