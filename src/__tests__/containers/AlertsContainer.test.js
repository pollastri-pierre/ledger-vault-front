import React from 'react';
import { shallow } from 'enzyme';
import { MessagesContainer, allMessages, getTitle, getTheme, getContent } from '../../containers/AlertsContainer';
import { Alert } from '../../components';
import { AUTHENTICATION_SUCCEED, CHECK_TEAM_ERROR, AUTHENTICATION_FAILED, AUTHENTICATION_FAILED_API, AUTHENTICATION_FAILED_TIMEOUT, LOGOUT } from '../../redux/modules/auth';
import { GOT_OPERATION_FAIL } from '../../redux/modules/operations';
import { SAVED_ACCOUNT } from '../../redux/modules/account-creation';
import { ABORTED, APPROVED } from '../../redux/modules/entity-approve';

describe('AlertsContainer container', () => {
  const first = allMessages[0];

  const fakeAlerts = {
    alerts: [{
      id: first,
      type: 'error',
    }],
    cache: [{
      id: first,
      type: 'error',
    }],
  };

  const ccontext = { translate: jest.fn() };

  it('should handle all these MESSAGES', () => {
    expect(allMessages).toEqual([
      SAVED_ACCOUNT,
      CHECK_TEAM_ERROR,
      AUTHENTICATION_FAILED,
      AUTHENTICATION_FAILED_API,
      AUTHENTICATION_FAILED_TIMEOUT,
      LOGOUT,
      GOT_OPERATION_FAIL,
      AUTHENTICATION_SUCCEED,
      ABORTED,
      APPROVED,
    ]);
  });

  it('should render as many Alert as allMessages length', () => {
    const wrapper = shallow(<MessagesContainer alerts={fakeAlerts} onClose={jest.fn()} />, {
      context: ccontext,
    });
    expect(wrapper.find(Alert).length).toBe(allMessages.length);
  });

  it('the first Alert should have open set to true', () => {
    const wrapper = shallow(<MessagesContainer alerts={fakeAlerts} onClose={jest.fn()} />, {
      context: ccontext,
    });
    expect(wrapper.find(Alert).first().prop('open')).toBe(true);
  });

  it('the first Alert should have theme set to error', () => {
    const wrapper = shallow(<MessagesContainer alerts={fakeAlerts} onClose={jest.fn()} />, {
      context: ccontext,
    });
    expect(wrapper.find(Alert).first().prop('theme')).toBe('error');
  });

  it('getTitle should return the title', () => {
    const translate = str => str;
    const alerts = [{ id: '1', title: 'title' }];
    expect(getTitle('1', alerts, translate)).toBe('title');
  });

  it('getContent should return the content', () => {
    const translate = str => str;
    const alerts = [{ id: '1', title: 'title', content: 'message' }];
    expect(getContent('1', alerts, translate)).toBe('message');
  });

  it('getTheme should return the theme', () => {
    const alerts = [{ id: '1', title: 'theme', type: 'error' }];
    expect(getTheme('1', alerts)).toBe('error');
  });
});

