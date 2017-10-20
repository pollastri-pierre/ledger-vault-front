import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React from 'react';
import { shallow, mount } from 'enzyme';
import AccountCreationMembers from '../../../../components/accounts/creation/AccountCreationMembers';

describe('AccountCreationMembers test', () => {
  const props = {
    getOrganizationMembers: jest.fn(),
    switchInternalModal: jest.fn(),
    addMember: jest.fn(),
    organization: {
      isLoading: false,
      members: [
        {
          id: 1,
          firstname: 'Stéphane',
          name: 'Maniaci',
          pub_key: 'hash1',
          picture: '',
        },
        {
          id: 2,
          firstname: 'Mateo',
          name: 'Triand',
          pub_key: 'hash2',
          picture: '',
        },
      ],
    },
    members: [],
  };

  const sPropsLoading = {
    ...props,
    organization: {
      ...props.organization,
      members: null,
    },
  };

  // const wrapper = shallow(<AccountCreationMembers {...props} />);
  // const loadingWrapper = shallow(<AccountCreationMembers {...sPropsLoading} />);

  injectTapEventPlugin();

  it('should render in .account-creation-members.wrapper div', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    expect(wrapper.prop('className')).toBe('account-creation-members wrapper');
  });

  it('should not call getOrganizationMembers if members are loaded', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });

    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <AccountCreationMembers {...props} />
      </MuiThemeProvider>,
    );
    expect(props.getOrganizationMembers).not.toHaveBeenCalled();
  });

  it('should call getOrganizationMembers if members are not loaded', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });

    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <AccountCreationMembers {...sPropsLoading} />
      </MuiThemeProvider>,
    );
    expect(props.getOrganizationMembers).toHaveBeenCalled();
  });

  // testing loading view
  it('should display a CircularPgoress', () => {
    const loadingWrapper = shallow(<AccountCreationMembers {...sPropsLoading} />);
    expect(loadingWrapper.find('CircularProgress').length).toBe(1);
  });

  it('the modal loading should contain a footer', () => {
    const loadingWrapper = shallow(<AccountCreationMembers {...sPropsLoading} />);
    expect(loadingWrapper.find('.footer').length).toBe(1);
  });

  it('the modal loading should contain a footer whith a DialogButton', () => {
    const loadingWrapper = shallow(<AccountCreationMembers {...sPropsLoading} />);
    const footer = loadingWrapper.find('.footer');
    expect(footer.find('DialogButton').length).toBe(1);
  });

  it('the modal loading should contain a footer whith a DialogButton wich right onTap callback', () => {
    const loadingWrapper = shallow(<AccountCreationMembers {...sPropsLoading} />);
    const footer = loadingWrapper.find('.footer');
    const button = footer.find('DialogButton');

    button.simulate('touchTap');
    expect(props.switchInternalModal).toHaveBeenCalled();
  });

  // testing when members is loaded
  it('should display a h2 with Member', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    expect(wrapper.find('h2').text()).toBe('Members');
  });

  it('should display a p.info', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    expect(wrapper.find('p').at(0).prop('className')).toBe('info');
  });

  it('should display a content and inner div', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    expect(wrapper.find('.content').length).toBe(1);
  });

  it('inner div should display the list of members', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    const inner = wrapper.find('.content').children().at(0);

    expect(inner.children().length).toBe(props.organization.members.length);
  });

  it('row member should have class account-member-row', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    const inner = wrapper.find('.content').children().at(0);

    expect(inner.children().at(0).prop('className')).toBe('account-member-row');
  });

  it('member row should display Avatar with right props', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    const inner = wrapper.find('.content').children().at(0);
    const row = inner.children().at(0);

    expect(row.find('Avatar').prop('className')).toBe('member-avatar-img');
    expect(row.find('Avatar').prop('url')).toBe(props.organization.members[0].picture);
  });

  it('member row should display Checkbox with right props', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    const inner = wrapper.find('.content').children().at(0);
    const row = inner.children().at(0);

    expect(row.find('Checkbox').prop('id')).toBe(props.organization.members[0].id);
    expect(row.find('Checkbox').prop('checked')).toBe(false);
  });

  it('click on member row should call addMember', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    const inner = wrapper.find('.content').children().at(0);
    const row = inner.children().at(0);

    row.simulate('click');
    expect(props.addMember).toHaveBeenCalled();
  });

  it('row member should display firstname + name', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    const inner = wrapper.find('.content').children().at(0);
    const row = inner.children().at(0);
    expect(row.find('.name').text()).toBe(`${props.organization.members[0].firstname} ${props.organization.members[0].name}`);
  });

  it('Checbox should be checked if array contains the item', () => {
    const aProps = {
      ...props,
      members: ['hash1'],
    };

    const wrapper = shallow(<AccountCreationMembers {...aProps} />);
    const inner = wrapper.find('.content').children().at(0);
    const row = inner.children().at(0);
    expect(row.find('Checkbox').prop('checked')).toBe(true);
  });

  it('the modal should contain a footer whith a DialogButton wich right onTap callback', () => {
    const wrapper = shallow(<AccountCreationMembers {...props} />);
    const footer = wrapper.find('.footer');
    const button = footer.find('DialogButton');

    button.simulate('touchTap');
    expect(props.switchInternalModal).toHaveBeenCalled();
  });
});
