import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { shallow, mount } from "enzyme";
import AccountApproveMembers from "../../../../components/accounts/approve/AccountApproveMembers";

const props = {
  getOrganizationMembers: jest.fn(),
  organization: {
    members: null,
    isLoading: false
  },
  account: {
    security: {
      members: []
    }
  }
};

injectTapEventPlugin();

describe("AccountApproveMembers tab component", () => {
  afterEach(() => {
    props.getOrganizationMembers.mockReset();
    props.getOrganizationMembers.mockRestore();
  });

  describe("Loading state", () => {
    it("should call getOrganizationMembers()", () => {
      const muiTheme = getMuiTheme({
        fontFamily: "Open Sans, sans-serif"
      });
      mount(
        <MuiThemeProvider muiTheme={muiTheme}>
          <AccountApproveMembers {...props} />
        </MuiThemeProvider>
      );

      expect(props.getOrganizationMembers).toHaveBeenCalled();
    });

    it("should not call getOrganizationMembers() if already loading", () => {
      const sProps = {
        ...props,
        organization: {
          ...props.organization,
          isLoading: true
        }
      };
      const muiTheme = getMuiTheme({
        fontFamily: "Open Sans, sans-serif"
      });
      mount(
        <MuiThemeProvider muiTheme={muiTheme}>
          <AccountApproveMembers {...sProps} />
        </MuiThemeProvider>
      );

      expect(props.getOrganizationMembers).not.toHaveBeenCalled();
    });

    it("should display a CircularProgress", () => {
      const wrapper = shallow(<AccountApproveMembers {...props} />);
      expect(wrapper.name()).toBe("CircularProgress");
    });
  });

  describe("Data ready state", () => {
    const sProps = {
      ...props,
      organization: {
        ...props.organization,
        isLoading: false,
        members: [
          {
            id: 1,
            pub_key: "hash1",
            name: "Teissier",
            firstname: "Florent",
            picture: "pathToUrl",
            role: "admin"
          }
        ]
      },
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          members: ["hash1"]
        }
      }
    };

    it("should not call getOrganizationMembers()", () => {
      const muiTheme = getMuiTheme({
        fontFamily: "Open Sans, sans-serif"
      });
      mount(
        <MuiThemeProvider muiTheme={muiTheme}>
          <AccountApproveMembers {...sProps} />
        </MuiThemeProvider>
      );

      expect(props.getOrganizationMembers).not.toHaveBeenCalled();
    });

    it("should be a .account-creation-members", () => {
      const wrapper = shallow(<AccountApproveMembers {...sProps} />);
      expect(wrapper.prop("className")).toBe("account-creation-members");
    });

    it("should have a .info.approve", () => {
      const wrapper = shallow(<AccountApproveMembers {...sProps} />);
      expect(wrapper.find(".info.approve").length).toBe(1);
    });

    it("should display each member in .account-member-row", () => {
      const wrapper = shallow(<AccountApproveMembers {...sProps} />);
      expect(wrapper.find(".account-member-row").length).toBe(1);
    });

    it("should display the Avatar", () => {
      const wrapper = shallow(<AccountApproveMembers {...sProps} />);
      const Avatar = wrapper
        .find(".account-member-row")
        .at(0)
        .find(".member-avatar")
        .children();

      expect(Avatar.name()).toBe("Avatar");
      expect(Avatar.prop("className")).toBe("member-avatar-img");
      expect(Avatar.prop("url")).toBe("pathToUrl");
    });

    it("should display the Firstname+Name of member", () => {
      const wrapper = shallow(<AccountApproveMembers {...sProps} />);
      expect(
        wrapper
          .find(".account-member-row")
          .at(0)
          .find(".name")
          .text()
      ).toBe("Florent Teissier");
    });

    it("should display the role of member", () => {
      const wrapper = shallow(<AccountApproveMembers {...sProps} />);
      expect(
        wrapper
          .find(".account-member-row")
          .at(0)
          .find(".role")
          .text()
      ).toBe("admin");
    });
  });
});
