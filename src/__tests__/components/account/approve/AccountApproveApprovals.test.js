import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { shallow, mount } from 'enzyme';
import AccountApproveApprovals from '../../../../components/accounts/approve/AccountApproveApprovals';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});

const props = {
  getOrganizationApprovers: jest.fn(),
  organization: {
    approvers: null,
    isLoadingApprovers: false,
  },
  account: {
    approved: ['hash1'],
  },
};

describe('AccountApproveApprovals tab component', () => {
  afterEach(() => {
    props.getOrganizationApprovers.mockReset();
    props.getOrganizationApprovers.mockRestore();
  });

  describe('Loading state', () => {
    it('should call getOrganizationApprovers()', () => {
      mount(
        <MuiThemeProvider muiTheme={muiTheme}>
          <AccountApproveApprovals {...props} />
        </MuiThemeProvider>,
      );

      expect(props.getOrganizationApprovers).toHaveBeenCalled();
    });

    it('should not call getOrganizationApprovers() if already loading', () => {
      const sProps = {
        ...props,
        organization: {
          ...props.organization,
          isLoadingApprovers: true,
        },
      };
      mount(
        <MuiThemeProvider muiTheme={muiTheme}>
          <AccountApproveApprovals {...sProps} />
        </MuiThemeProvider>,
      );

      expect(props.getOrganizationApprovers).not.toHaveBeenCalled();
    });

    it('should display a CircularProgress', () => {
      const wrapper = shallow(<AccountApproveApprovals {...props} />);
      expect(wrapper.name()).toBe('CircularProgress');
    });
  });

  describe('Data ready state', () => {
    const sProps = {
      ...props,
      organization: {
        ...props.organization,
        isLoadingApprovers: false,
        approvers: [
          {
            id: 1,
            name: 'Teissier',
            firstname: 'Florent',
            picture: 'urlToFlorent',
            pub_key: 'hash1',
          },
          {
            id: 2,
            name: 'Obama',
            firstname: 'Barrak',
            picture: 'urlToBarrak',
            pub_key: 'hash2',
          },
        ],
      },
    };

    it('should be a .account-creation-members', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      expect(wrapper.prop('className')).toBe('account-creation-members');
    });

    it('should have a .info.approve', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      expect(wrapper.find('.account-creation-members .info.approve').length).toBe(1);
    });

    it('should display all the approvers', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      expect(wrapper.find('.account-creation-members .account-member-approval').length).toBe(2);
    });

    it('the first one should be approved', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const First = wrapper.find('.account-creation-members .account-member-approval').at(0);

      expect(First.find('.badge-approved').find('ValidateBadge').length).toBe(1);
    });

    it('the first should display the right avatar', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const First = wrapper.find('.account-creation-members .account-member-approval').at(0);

      expect(First.find('Avatar').prop('url')).toBe('urlToFlorent');
    });

    it('the first should display the right firstname+name', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const First = wrapper.find('.account-creation-members .account-member-approval').at(0);

      expect(First.find('.name').text()).toBe('Florent Teissier');
    });

    it('the first should display approved', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const First = wrapper.find('.account-creation-members .account-member-approval').at(0);

      expect(First.find('.has-approved').text()).toBe('Approved');
    });

    it('the second one should not be approved', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const Second = wrapper.find('.account-creation-members .account-member-approval').at(1);

      expect(Second.find('.badge-approved.not-approved').find('Question').length).toBe(1);
    });

    it('the second should display the right avatar', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const Second = wrapper.find('.account-creation-members .account-member-approval').at(1);

      expect(Second.find('Avatar').prop('url')).toBe('urlToBarrak');
    });

    it('the second should display the right firstname+name', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const Second = wrapper.find('.account-creation-members .account-member-approval').at(1);

      expect(Second.find('.name').text()).toBe('Barrak Obama');
    });

    it('the second should display pending', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const Second = wrapper.find('.account-creation-members .account-member-approval').at(1);

      expect(Second.find('.has-approved').text()).toBe('Pending');
    });

    it('should display the percentage of approvals in .approval-percentage', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      const Percentage = wrapper.find('.approval-percentage');

      expect(Percentage.find('p').text()).toBe('1 collected, 1 remaining (50%)');
    });

    it('should display a percentage bar', () => {
      const wrapper = shallow(<AccountApproveApprovals {...sProps} />);
      expect(wrapper.find('.approval-percentage .percentage-bar .percentage-bar-fill').length).toBe(1);
    });
  });
});
