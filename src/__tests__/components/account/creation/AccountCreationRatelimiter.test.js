import React from 'react';
import { shallow } from 'enzyme';
import AccountCreationRateLimiter from '../../../../components/accounts/creation/AccountCreationRateLimiter';

describe('AccountCreationRateLimiter test', () => {
  const props = {
    ratelimiter: {
      enabled: false,
      rate: '3',
      frequency: 'day',
    },
    popbubble: false,
    anchor: {},
    switchInternalModal: jest.fn(),
    enable: jest.fn(),
    openPopBubble: jest.fn(),
    change: jest.fn(),
    changeFrequency: jest.fn(),
  };

  it('should render an small-modal div', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    expect(wrapper.prop('className')).toBe('small-modal');
  });

  it('should render an h3 with Rate Limiter', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    expect(wrapper.find('h3').text()).toBe('Rate Limiter');
  });

  it('should render a content div', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    expect(wrapper.find('.content').length).toBe(1);
  });

  it('content should contain a form-field-checkbox with a Checkbox', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const content = wrapper.find('.content');

    expect(content.find('.form-field-checkbox').length).toBe(1);
    expect(content.find('.form-field-checkbox').find('Checkbox').length).toBe(1);
  });

  it('click on form-field-checkbox should trigger enable', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const content = wrapper.find('.content');
    const row = content.find('.form-field-checkbox');
    row.simulate('click');
    expect(props.enable).toHaveBeenCalled();
  });

  it('checkbox should be rendered with checked and handle', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const content = wrapper.find('.content');
    const checkbox = content.find('.form-field-checkbox').find('Checkbox');

    expect(checkbox.prop('checked')).toBe(props.ratelimiter.enabled);
    expect(checkbox.prop('handleInputChange')).toBe(props.enable);
  });

  it('should render a form-field', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    expect(form.length).toBe(1);
  });

  it('form-field should contain an input with value binded', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    expect(form.find('input').prop('value')).toBe(props.ratelimiter.rate);
  });

  it('input change should trigger change()', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    const input = form.find('input');

    input.simulate('change', { target: { value: 't' } });
    expect(props.change).toHaveBeenCalledWith('t');
  });

  it('should have .count .dropdown span with onClick set to openPopBubble', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    const span = form.find('.count.dropdown');
    span.simulate('click', { currentTarget: {} });
    expect(props.openPopBubble).toHaveBeenCalledWith({});
  });

  it('should have .count .dropdown span with correct content', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    const span = form.find('.count.dropdown');

    expect(span.text()).toBe('operation per day<ArrowDown />');
  });

  it('should contain the popbubble', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');

    expect(form.find('PopBubble').length).toBe(1);
  });

  it('popbubble should contain frequency-bubble', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');

    expect(form.find('PopBubble').find('.frequency-bubble').length).toBe(1);
  });

  it('frequency-bubble should contain 3 rows', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    const frequencies = form.find('PopBubble').find('.frequency-bubble');

    expect(frequencies.children().length).toBe(3);
  });

  it('frequency-bubble row should have class frequency-bubble-row', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    const frequencies = form.find('PopBubble').find('.frequency-bubble');

    expect(frequencies.children().at(0).prop('className')).toContain('frequency-bubble-row');
    expect(frequencies.children().at(1).prop('className')).toContain('frequency-bubble-row');
    expect(frequencies.children().at(2).prop('className')).toContain('frequency-bubble-row');
  });

  it('frequency-bubble-row should be selected', () => {
    const sProps = {
      ...props,
      ratelimiter: {
        ...props.ratelimiter,
        frequency: 'minut',
      },
    };
    const wrapper = shallow(<AccountCreationRateLimiter {...sProps} />);
    const form = wrapper.find('.form-field');
    const frequencies = form.find('PopBubble').find('.frequency-bubble');
    const row = frequencies.children().at(0);

    expect(row.prop('className')).toContain('active');
  });

  it('click on frequency-bubble-row should trigger changeFrequency', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const form = wrapper.find('.form-field');
    const frequencies = form.find('PopBubble').find('.frequency-bubble');
    frequencies.children().at(0).simulate('click');
    expect(props.changeFrequency).toHaveBeenCalledWith('rate-limiter', 'minut');
    frequencies.children().at(1).simulate('click');
    expect(props.changeFrequency).toHaveBeenCalledWith('rate-limiter', 'hour');
    frequencies.children().at(2).simulate('click');
    expect(props.changeFrequency).toHaveBeenCalledWith('rate-limiter', 'day');
  });

  it('should contain an info p', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const content = wrapper.find('.content');
    expect(content.find('p.info').length).toBe(1);
  });

  it('should contain a footer with a DialogButton', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const footer = wrapper.find('.footer');
    expect(footer.find('DialogButton').length).toBe(1);
  });

  it('click on dialogbutton button should call switchInternalModal', () => {
    const wrapper = shallow(<AccountCreationRateLimiter {...props} />);
    const footer = wrapper.find('.footer');
    const button = footer.find('DialogButton');
    button.simulate('touchTap');

    expect(props.switchInternalModal).toHaveBeenCalledWith('main');
  });
});
