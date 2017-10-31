// @flow

import React, { Component } from 'react';
import currencies from '../../../currencies';
import { PopBubble } from '../../../components';
import ArrowDown from '../../icons/ArrowDown';
import type { Currency } from '../../../datatypes';

import './OperationCreationDetails.css';

type Props = {
    account: {
      currency: Currency
    },
  };

class OperationCreationDetails extends Component<Props> {
  constructor(props: Props) {
    super(props);

    const { account } = this.props;
    this.currency = currencies.find(c => c.name === account.currency.name);

    this.state = {
      unit: this.currency.units[0],
      unitMenuOpen: false,
    };
  }

  currency: Currency;

  selectUnit = (e) => {
    e.preventDefault();
    const unitNb = e.target.dataset.unit;
    const unit = this.currency.units[unitNb];

    this.setState({ unit, unitMenuOpen: false });
  };

  render() {
    return (
      <div className="operation-creation-details wrapper">
        <div className="tab-title">Amount</div>
        <div
          className="operation-creation-unit-selector"
          ref={(e) => {
            this.anchor = e;
          }}
          onClick={() => this.setState({ unitMenuOpen: true })}
          role="button"
          tabIndex={0}
          style={{
            width: 'fit-content',
            cursor: 'pointer',
          }}
        >
          <div className="operation-creation-unit" style={{ float: 'left' }}>
            {this.state.unit.code}
          </div>
          <div className="operation-creation-arrow-down" style={{ float: 'left' }}>
            <ArrowDown />
          </div>
          <PopBubble
            open={this.state.unitMenuOpen}
            anchorEl={this.anchor}
            onRequestClose={() => this.setState({ unitMenuOpen: false })}
          >
            <ul className="operation-creation-unit-list">
              {this.currency.units.map((unit, index) => (
                <li key={unit.name}>
                  <a
                    href="unit"
                    onClick={this.selectUnit}
                    data-unit={index}
                    className={unit.name === this.state.unit.name ? 'active' : ''}
                  >
                    {unit.code}
                  </a>
                </li>
              ))}
            </ul>
          </PopBubble>
        </div>
        <div className="operation-creation-amount-selector">blah</div>
        <br />
        <div className="tab-title">Address to credit</div>
        <br />
        <div className="tab-title">Confirmation fees</div>
      </div>
    );
  }
}

export default OperationCreationDetails;
