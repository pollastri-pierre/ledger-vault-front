import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { mount, shallow } from 'enzyme';
import { PendingRequestNotDecorated } from '../../containers/PendingRequests/PendingRequests';

const props = {
  onGetPendingRequests: jest.fn(),
  onOpenAccountApprove: jest.fn(),
  onGetOrganizationApprovers: jest.fn(),
  organization: {
    members: null,
    approvers: null,
    isLoading: false,
    isLoadingApprovers: false,
  },
  pendingRequests: {
    data: null,
    isLoading: false,
  },
};

injectTapEventPlugin();


describe('PendingRequests container', () => {
  afterEach(() => {
    props.onGetPendingRequests.mockReset();
    props.onGetPendingRequests.mockRestore();
    props.onOpenAccountApprove.mockReset();
    props.onOpenAccountApprove.mockRestore();
    props.onGetOrganizationApprovers.mockReset();
    props.onGetOrganizationApprovers.mockRestore();
  });

  it('should call onGetPendingRequests when mounting', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });
    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <PendingRequestNotDecorated {...props} />
      </MuiThemeProvider>,
    );

    expect(props.onGetPendingRequests).toHaveBeenCalled();
  });

  it('should not call onGetPendingRequests when mounting if already loading', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });

    const sProps = {
      ...props,
      pendingRequests: {
        ...props.pendingRequests,
        isLoading: true,
      },
    };

    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <PendingRequestNotDecorated {...sProps} />
      </MuiThemeProvider>,
    );

    expect(props.onGetPendingRequests).not.toHaveBeenCalled();
  });

  it('should not call onGetPendingRequests when mounting if data exist', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });

    const sProps = {
      ...props,
      pendingRequests: {
        ...props.pendingRequests,
        data: {},
      },
    };

    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <PendingRequestNotDecorated {...sProps} />
      </MuiThemeProvider>,
    );

    expect(props.onGetPendingRequests).not.toHaveBeenCalled();
  });

  it('should call onGetOrganizationApprovers when mounting', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });
    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <PendingRequestNotDecorated {...props} />
      </MuiThemeProvider>,
    );

    expect(props.onGetOrganizationApprovers).toHaveBeenCalled();
  });

  it('should not call onGetOrganizationApprovers when mounting if data exist', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });

    const sProps = {
      ...props,
      organization: {
        ...props.organization,
        approvers: ['hash'],
      },
    };

    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <PendingRequestNotDecorated {...sProps} />
      </MuiThemeProvider>,
    );

    expect(props.onGetOrganizationApprovers).not.toHaveBeenCalled();
  });

  it('should not call onGetOrganizationApprovers when mounting if already loading', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });

    const sProps = {
      ...props,
      organization: {
        ...props.organization,
        isLoadingApprovers: true,
      },
    };

    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <PendingRequestNotDecorated {...sProps} />
      </MuiThemeProvider>,
    );

    expect(props.onGetOrganizationApprovers).not.toHaveBeenCalled();
  });

  it('should call onGetOrganizationApprovers when mounting', () => {
    const muiTheme = getMuiTheme({
      fontFamily: 'Open Sans, sans-serif',
    });
    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <PendingRequestNotDecorated {...props} />
      </MuiThemeProvider>,
    );

    expect(props.onGetOrganizationApprovers).toHaveBeenCalled();
  });

  it('should be a .pending-requests div', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.prop('className')).toBe('pending-requests');
  });

  it('.pending-requests should have a .pending-left and .pending-right', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-left').length).toBe(1);
    expect(wrapper.find('.pending-right').length).toBe(1);
  });

  it('.first bloc in pending-left should have an h3 Operations to approve', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-left .bloc')
      .at(0)
      .find('h3')
      .text(),
    ).toBe('Operations to approve');
  });

  it('.first bloc in pending-left should have a loader if data is loading', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-left .bloc')
      .at(0)
      .find('CircularProgress')
      .length,
    ).toBe(1);
  });

  it('.second bloc in pending-left should have an h3 Operations to watch', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-left .bloc')
      .at(1)
      .find('h3')
      .text(),
    ).toBe('Operations to watch');
  });

  it('.second bloc in pending-left should have a loader if data is loading', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-left .bloc')
      .at(1)
      .find('CircularProgress')
      .length,
    ).toBe(1);
  });

  it('.first bloc in pending-right should have an h3 Account to approve', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-right .bloc')
      .at(0)
      .find('h3')
      .text(),
    ).toBe('Accounts to approve');
  });

  it('.first bloc in pending-left should have a loader if data is loading', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-right .bloc')
      .at(0)
      .find('CircularProgress')
      .length,
    ).toBe(1);
  });

  it('.second bloc in pending-right should have an h3 Account to watch', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-right .bloc')
      .at(1)
      .find('h3')
      .text(),
    ).toBe('Accounts to watch');
  });

  it('.second bloc in pending-left should have a loader if data is loading', () => {
    const wrapper = shallow(<PendingRequestNotDecorated {...props} />);
    expect(wrapper.find('.pending-right .bloc')
      .at(1)
      .find('CircularProgress')
      .length,
    ).toBe(1);
  });

  it('.first bloc in pending-right should display a PendingAccountApprove if data ready', () => {
    const sProps = {
      ...props,
      organization: {
        ...props.organization,
        isLoadingApprovers: false,
        approvers: [{ id: 1, pub_key: 'hash' }],
      },
      pendingRequests: {
        ...props.pendingRequests,
        data: {
          watchOperations: [{}],
          approveOperations: [{}],
          watchAccounts: [{}],
          approveAccounts: [{}],
        },
        isLoading: false,
      },

    };
    const wrapper = shallow(<PendingRequestNotDecorated {...sProps} />);
    const Pending = wrapper.find('.pending-right .bloc').at(0).find('PendingAccountApprove');

    // console.log(wrapper.find('.pending-right .bloc').at(1));
    expect(Pending.prop('accounts')).toEqual(sProps.pendingRequests.data.watchAccounts);
    expect(Pending.prop('approvers')).toEqual(sProps.organization.approvers);
    expect(Pending.prop('approved')).toEqual(undefined);
    expect(Pending.prop('open')).toEqual(sProps.onOpenAccountApprove);
  });

  it('.second bloc in pending-right should display a PendingAccountApprove if data ready', () => {
    const sProps = {
      ...props,
      organization: {
        ...props.organization,
        isLoadingApprovers: false,
        approvers: [{ id: 1, pub_key: 'hash' }],
      },
      pendingRequests: {
        ...props.pendingRequests,
        data: {
          watchOperations: [{}],
          approveOperations: [{}],
          watchAccounts: [{}],
          approveAccounts: [{}],
        },
        isLoading: false,
      },

    };
    const wrapper = shallow(<PendingRequestNotDecorated {...sProps} />);
    const Pending = wrapper.find('.pending-right .bloc').at(1).find('PendingAccountApprove');

    // console.log(wrapper.find('.pending-right .bloc').at(1));
    expect(Pending.prop('accounts')).toEqual(sProps.pendingRequests.data.watchAccounts);
    expect(Pending.prop('approvers')).toEqual(sProps.organization.approvers);
    expect(Pending.prop('approved')).toEqual(true);
    expect(Pending.prop('open')).toEqual(sProps.onOpenAccountApprove);
  });
});

