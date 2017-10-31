import React from "react";
import { shallow } from "enzyme";
import AccountCreationApprovals from "../../../../components/accounts/creation/AccountCreationApprovals";

describe("AccountCreationApprovals test", () => {
  const props = {
    switchInternalModal: jest.fn(),
    setApprovals: jest.fn(),
    approvals: "",
    members: []
  };

  const wrapper = shallow(<AccountCreationApprovals {...props} />);
  // const wrapperDom = mount(<AccountCreationApprovals {...props} />);

  it("should render in .small-modal.wrapper div", () => {
    expect(wrapper.prop("className")).toBe("small-modal wrapper");
  });

  it("should render a h3 with Approvals", () => {
    expect(wrapper.find("h3").text()).toBe("Approvals");
  });

  it("should render a content div", () => {
    expect(wrapper.find(".content").length).toBe(1);
  });

  it("should render a footer", () => {
    expect(wrapper.find(".footer").length).toBe(1);
  });

  it("footer should have DialogButton", () => {
    const footer = wrapper.find(".footer");
    expect(footer.find("DialogButton").length).toBe(1);
  });

  it("should have an input with correct value set", () => {
    const input = wrapper.find("input");
    expect(input.prop("value")).toBe(props.approvals);
  });

  it("onchange on input should trigget setApprovals with the value typed", () => {
    const input = wrapper.find("input");
    input.simulate("change", { target: { value: "a" } });
    expect(props.setApprovals).toHaveBeenCalledWith("a");
  });

  it("the dialogbutton should call switchInternalModal on click", () => {
    const footer = wrapper.find(".footer");
    const button = footer.find("DialogButton");

    button.simulate("touchTap");
    expect(props.switchInternalModal).toHaveBeenCalled();
  });
});
