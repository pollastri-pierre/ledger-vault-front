import { shallow } from 'enzyme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppNotDecorated } from '../../containers/App/App';
import { ActionBar, Menu, Content } from '../../components';

describe('App container', () => {
  const props = {
    blurredBG: true,
    profile: {},
    onLogout: jest.fn(),
    onOpenCloseProfile: jest.fn(),
    onOpenCloseEdit: jest.fn(),
    accounts: {},
    onGetAccounts: jest.fn(),
    routing: {
      location: {
        pathname: '/',
      },
    },
  };

  const wrapper = shallow(AppNotDecorated(props));

  it('should render a Menu', () => {
    expect(wrapper.find(Menu).length).toBe(1);
  });

  it('should render a Content', () => {
    expect(wrapper.find(Content).length).toBe(1);
  });

  it('should render an ActionBar with profile and logout props', () => {
    const actionBar = wrapper.find(ActionBar);
    expect(actionBar.length).toBe(1);
    expect(actionBar.prop('logout')).toBe(props.onLogout);
    expect(actionBar.prop('profile')).toBe(props.profile);
  });

  it('should render a div with App blurred class', () => {
    expect(wrapper.hasClass('App')).toBe(true);
    expect(wrapper.hasClass('blurred')).toBe(true);
  });

  it('should render a div with App className but not blurred', () => {
    const propsNotBlurred = {
      blurredBG: false,
      profile: {},
      onLogout: jest.fn(),
      onOpenCloseProfile: jest.fn(),
      onOpenCloseEdit: jest.fn(),
      accounts: {},
      onGetAccounts: jest.fn(),
      routing: {
        location: {
          pathname: '/',
        },
      },
    };

    const wrapper2 = shallow(AppNotDecorated(propsNotBlurred));

    expect(wrapper2.hasClass('App')).toBe(true);
    expect(wrapper2.hasClass('blurred')).toBe(false);
  });
});
