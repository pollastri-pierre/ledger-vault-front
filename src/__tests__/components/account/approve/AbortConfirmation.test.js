import React from "react";
import { shallow } from "enzyme";
import AbortConfirmation from "../../../../components/accounts/approve/AbortConfirmation";

const props = {
  abort: jest.fn(),
  aborting: jest.fn()
};

describe("AbortConfirmation component", () => {
  it("should display an #account-abort-confirmation.small-modal", () => {
    const wrapper = shallow(<AbortConfirmation {...props} />);
    expect(wrapper.prop("id")).toBe("account-abort-confirmation");
    expect(wrapper.prop("className")).toBe("small-modal");
  });

  it("should have a header with h3 and Trash icon", () => {
    const wrapper = shallow(<AbortConfirmation {...props} />);

    expect(wrapper.find("header h3").text()).toBe("Abort account");
    expect(
      wrapper
        .find("header")
        .find("Trash")
        .prop("className")
    ).toBe("trash-icon");
  });

  it("should have a .content", () => {
    const wrapper = shallow(<AbortConfirmation {...props} />);
    expect(wrapper.find(".content").length).toBe(1);
  });

  it("First DialogButton in Footer should be binded to aborting()", () => {
    const wrapper = shallow(<AbortConfirmation {...props} />);
    const First = wrapper
      .find(".footer")
      .find("DialogButton")
      .at(0);

    expect(First.prop("className")).toBe("cancel margin");

    First.simulate("touchTap");
    expect(props.aborting).toHaveBeenCalled();
  });

  it("Second DialogButton in Footer should be binded to abort()", () => {
    const wrapper = shallow(<AbortConfirmation {...props} />);
    const Second = wrapper
      .find(".footer")
      .find("DialogButton")
      .at(1);

    Second.simulate("touchTap");
    expect(props.abort).toHaveBeenCalled();
  });
});
