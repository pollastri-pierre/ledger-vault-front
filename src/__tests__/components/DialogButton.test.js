import React from 'react';
import { shallow, mount, render } from 'enzyme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { DialogButton } from '../../components';

injectTapEventPlugin();

describe('DialogButton', () => {
  it('should render children', () => {
    const children = (<p>test</p>);

    const wrapper = mount(<DialogButton children={children} />);
    expect(wrapper.find('button').children().matchesElement(<p>test</p>)).toBe(true);
  });

  it('should has vlt-dialog-btn class', () => {
    const wrapper = mount(<DialogButton />);
    expect(wrapper.find('button').hasClass('vlt-dialog-btn')).toBe(true);
  });

  it('should not has highlight class', () => {
    const wrapper = mount(<DialogButton />);
    expect(wrapper.find('button').hasClass('highlight')).toBe(false);
  });
  it('should has highlight class', () => {
    const wrapper = mount(<DialogButton highlight/>);
    expect(wrapper.find('button').hasClass('highlight')).toBe(true);
  });
});
