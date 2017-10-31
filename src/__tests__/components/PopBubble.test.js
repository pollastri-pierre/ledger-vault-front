import React from "react";
import { shallow, mount, render } from "enzyme";
import { PopBubble } from "../../components";

describe("PopBubble", () => {
  it("should have a Popover item", () => {
    const children = <p>test</p>;
    const wrapper = shallow(<PopBubble />);
    expect(wrapper.find("Popover").length).toEqual(1);
  });

  it("should render children", () => {
    const children = <p>test</p>;
    const wrapper = shallow(<PopBubble children={children} />);

    expect(
      wrapper
        .children()
        .at(0)
        .matchesElement(<p>test</p>)
    ).toBe(true);
  });

  it("should have a pop-bubble class", () => {
    const wrapper = shallow(<PopBubble />);
    expect(wrapper.hasClass("pop-bubble")).toBe(true);
  });

  it("should accept styles as props", () => {
    const style = {
      color: "red"
    };

    const wrapper = shallow(<PopBubble style={style} />);

    expect(wrapper.props().style).toEqual({
      marginTop: "15px",
      borderRadius: 0,
      color: "red"
    });
  });
});
