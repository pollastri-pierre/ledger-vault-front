import React from 'react';
import { shallow } from 'enzyme';
import { MessagesContainer, allMessages, getTitle, getTheme, getContent } from '../../containers/AlertsContainer';
import { Alert } from '../../components';

describe('AlertsContainer container', () => {
  const first = allMessages[0];

  const alerts = {
    alerts: [{
      id: first,
      type: 'error',
    }],
    cache: [{
      id: first,
      type: 'error',
    }],
  };

  const context = { translate: jest.fn() };

  it('should render as many Alert as allMessages length', () => {
    const wrapper = shallow(<MessagesContainer alerts={alerts} onClose={jest.fn()} />, {context: context});
    expect(wrapper.find(Alert).length).toBe(allMessages.length);
  });

  it('the first Alert should have open set to true', () => {
    const wrapper = shallow(<MessagesContainer alerts={alerts} onClose={jest.fn()} />, {context: context});
    expect(wrapper.find(Alert).first().prop('open')).toBe(true);
  });

  it('the first Alert should have theme set to error', () => {
    const wrapper = shallow(<MessagesContainer alerts={alerts} onClose={jest.fn()} />, {context: context});
    expect(wrapper.find(Alert).first().prop('theme')).toBe('error');
  });

  it('getTitle should return the title', () => {
    const translate = (str) => str;
    const alerts = [{id: '1', title: 'title'}]
    expect(getTitle('1', alerts, translate)).toBe('title');
  });

  it('getContent should return the content', () => {
    const translate = (str) => str;
    const alerts = [{id: '1', title: 'title', content: 'message'}]
    expect(getContent('1', alerts, translate)).toBe('message');
  });

  it('getTheme should return the theme', () => {
    const translate = (str) => str;
    const alerts = [{id: '1', title: 'theme', type: 'error'}]
    expect(getTheme('1', alerts)).toBe('error');
  });
});



