import React from 'react';
import { shallow } from 'enzyme';
import BalanceCard from '../../containers/Account/BalanceCard';

describe('BalanceCard component', () => {
  it('should have a h3 balance title when data', () => {
    const props = {
      data: {
        value: '1',
        date: new Date().toString(),
      },
      loading: false,
    };

    const wrapper = shallow(<BalanceCard {...props} />);
    const h3 = wrapper.find('h3');

    expect(h3.length).toBe(1);
    expect(h3.text()).toBe('Balance');
  });

  it('should have a h3 balance title when loading', () => {
    const props = {
      data: {
        value: '1',
        date: new Date().toString(),
      },
      loading: true,
    };

    const wrapper = shallow(<BalanceCard {...props} />);
    const h3 = wrapper.find('h3');

    expect(h3.length).toBe(1);
    expect(h3.text()).toBe('Balance');
  });

  it('should display data if loading false and data not null', () => {
    const props = {
      data: {
        value: '1',
        date: 'date',
      },
      loading: false,
    };

    const wrapper = shallow(<BalanceCard {...props} />);

    expect(wrapper.containsMatchingElement(
      <div className="bloc-content">
        <p className="amount">1</p>
        <span className="date">date</span>
      </div>,
    )).toBe(true);
  });

  it('should display a SpinnerCard if loading', () => {
    const props = {
      data: {
        value: '1',
        date: new Date().toString(),
      },
      loading: true,
    };

    const wrapper = shallow(<BalanceCard {...props } />);
    const spinner = wrapper.find('SpinnerCard');

    expect(spinner.length).toBe(1);
  });

});
