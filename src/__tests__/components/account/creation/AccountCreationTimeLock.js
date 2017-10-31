import React from "react";
import { shallow } from "enzyme";
import AccountCreationTimeLock from "../../../../components/accounts/creation/AccountCreationTimeLock";

describe("AccountCreationTimeLock test", () => {
  const props = {
    timelock: {
      enabled: false,
      duration: "3",
      frequency: "days"
    },
    popbubble: false,
    anchor: {},
    switchInternalModal: jest.fn(),
    enable: jest.fn(),
    openPopBubble: jest.fn(),
    change: jest.fn(),
    changeFrequency: jest.fn()
  };

  it("should render an small-modal div", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    expect(wrapper.prop("className")).toBe("small-modal");
  });

  it("should render an h3 with Time-lock", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    expect(wrapper.find("h3").text()).toBe("Time-lock");
  });

  it("should render a content div", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    expect(wrapper.find(".content").length).toBe(1);
  });

  it("content should contain a form-field-checkbox with a Checkbox", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const content = wrapper.find(".content");

    expect(content.find(".form-field-checkbox").length).toBe(1);
    expect(content.find(".form-field-checkbox").find("Checkbox").length).toBe(
      1
    );
  });

  it("click on form-field-checkbox should trigger enable", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const content = wrapper.find(".content");
    const row = content.find(".form-field-checkbox");
    row.simulate("click");
    expect(props.enable).toHaveBeenCalled();
  });

  it("checkbox should be rendered with checked and handle", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const content = wrapper.find(".content");
    const checkbox = content.find(".form-field-checkbox").find("Checkbox");

    expect(checkbox.prop("checked")).toBe(props.timelock.enabled);
    expect(checkbox.prop("handleInputChange")).toBe(props.enable);
  });

  it("should render a form-field", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    expect(form.length).toBe(1);
  });

  it("form-field should contain an input with value binded", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    expect(form.find("input").prop("value")).toBe(props.timelock.duration);
  });

  it("input change should trigger change()", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    const input = form.find("input");

    input.simulate("change", { target: { value: "t" } });
    expect(props.change).toHaveBeenCalledWith("t");
  });

  it("should have .count .dropdown span with onClick set to openPopBubble", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    const span = form.find(".count.dropdown");
    span.simulate("click", { currentTarget: {} });
    expect(props.openPopBubble).toHaveBeenCalledWith({});
  });

  it("should have .count .dropdown span with correct content", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    const span = form.find(".count.dropdown");

    expect(span.text()).toBe("days<ArrowDown />");
  });

  it("should contain the popbubble", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");

    expect(form.find("PopBubble").length).toBe(1);
  });

  it("popbubble should contain frequency-bubble", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");

    expect(form.find("PopBubble").find(".frequency-bubble").length).toBe(1);
  });

  it("frequency-bubble should contain 3 rows", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    const frequencies = form.find("PopBubble").find(".frequency-bubble");

    expect(frequencies.children().length).toBe(3);
  });

  it("frequency-bubble row should have class frequency-bubble-row", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    const frequencies = form.find("PopBubble").find(".frequency-bubble");

    expect(
      frequencies
        .children()
        .at(0)
        .prop("className")
    ).toContain("frequency-bubble-row");
    expect(
      frequencies
        .children()
        .at(1)
        .prop("className")
    ).toContain("frequency-bubble-row");
    expect(
      frequencies
        .children()
        .at(2)
        .prop("className")
    ).toContain("frequency-bubble-row");
  });

  it("frequency-bubble-row should be selected", () => {
    const sProps = {
      ...props,
      timelock: {
        ...props.timelock,
        frequency: "minuts"
      }
    };
    const wrapper = shallow(<AccountCreationTimeLock {...sProps} />);
    const form = wrapper.find(".form-field");
    const frequencies = form.find("PopBubble").find(".frequency-bubble");
    const row = frequencies.children().at(0);

    expect(row.prop("className")).toContain("active");
  });

  it("click on frequency-bubble-row should trigger changeFrequency", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const form = wrapper.find(".form-field");
    const frequencies = form.find("PopBubble").find(".frequency-bubble");
    frequencies
      .children()
      .at(0)
      .simulate("click");
    expect(props.changeFrequency).toHaveBeenCalledWith("timelock", "minuts");
    frequencies
      .children()
      .at(1)
      .simulate("click");
    expect(props.changeFrequency).toHaveBeenCalledWith("timelock", "hours");
    frequencies
      .children()
      .at(2)
      .simulate("click");
    expect(props.changeFrequency).toHaveBeenCalledWith("timelock", "days");
  });

  it("should contain an info p", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const content = wrapper.find(".content");
    expect(content.find("p.info").length).toBe(1);
  });

  it("should contain a footer with a DialogButton", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const footer = wrapper.find(".footer");
    expect(footer.find("DialogButton").length).toBe(1);
  });

  it("click on dialogbutton button should call switchInternalModal", () => {
    const wrapper = shallow(<AccountCreationTimeLock {...props} />);
    const footer = wrapper.find(".footer");
    const button = footer.find("DialogButton");
    button.simulate("touchTap");

    expect(props.switchInternalModal).toHaveBeenCalledWith("main");
  });
});
