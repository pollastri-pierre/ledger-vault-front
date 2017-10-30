import React from "react";
import { mount, shallow } from "enzyme";
import { AccountViewNotDecorated } from "../../containers/Account/AccountView";

const props = {
  onGetOperation: jest.fn(),
  onGetOperations: jest.fn(),
  onGetReceiveAddress: jest.fn(),
  onGetCountervalue: jest.fn(),
  onGetBalance: jest.fn(),
  match: {
    params: {
      id: "1"
    }
  },
  accountsInfo: {
    balance: {},
    countervalue: {},
    receiveAddress: {},
    operations: [],
    isLoadingCounter: false,
    isLoadingAddress: false,
    isLoadingBalance: false,
    isLoadingOperations: false,
    isLoadingNextOperations: false
  }
};

describe("AccountView container", () => {
  it("should call update when mounting", () => {
    const spy = jest
      .spyOn(AccountViewNotDecorated.prototype, "update")
      .mockImplementation(() => {});
    mount(<AccountViewNotDecorated {...props} />);
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it("update should call getOperations, getBalance, getReceiveAddress and getCountervalue", () => {
    mount(<AccountViewNotDecorated {...props} />);
    expect(props.onGetOperations).toHaveBeenCalled();
    expect(props.onGetBalance).toHaveBeenCalled();
    expect(props.onGetReceiveAddress).toHaveBeenCalled();
    expect(props.onGetCountervalue).toHaveBeenCalled();
  });

  it("should have a account-view root component", () => {
    const wrapper = shallow(<AccountViewNotDecorated {...props} />);
    expect(wrapper.find(".account-view").length).toBe(1);
  });

  it("should have a account-view-infos component", () => {
    const wrapper = shallow(<AccountViewNotDecorated {...props} />);
    expect(wrapper.find(".account-view-infos").length).toBe(1);
  });

  it("should have a infos-left-top component", () => {
    const wrapper = shallow(<AccountViewNotDecorated {...props} />);
    expect(wrapper.find(".infos-left-top").length).toBe(1);
  });

  it("infos-left-top component should contain BalanceCard and CounterValueCard", () => {
    const wrapper = shallow(<AccountViewNotDecorated {...props} />);
    const infos = wrapper.find(".infos-left-top");
    expect(infos.find("BalanceCard").length).toBe(1);
    expect(infos.find("BalanceCard").prop("data")).toEqual(
      props.accountsInfo.balance
    );
    expect(infos.find("BalanceCard").prop("loading")).toEqual(
      props.accountsInfo.isLoadingBalance
    );

    expect(infos.find("CounterValueCard").length).toBe(1);
    expect(infos.find("CounterValueCard").prop("data")).toEqual(
      props.accountsInfo.countervalue
    );
    expect(infos.find("CounterValueCard").prop("loading")).toEqual(
      props.accountsInfo.isLoadingCounter
    );
  });

  it("infos-left component should contain ReceiveFundsCard component", () => {
    const wrapper = shallow(<AccountViewNotDecorated {...props} />);
    const infos = wrapper.find(".infos-left");
    expect(infos.find("ReceiveFundsCard").prop("data")).toEqual(
      props.accountsInfo.receiveAddress
    );
    expect(infos.find("ReceiveFundsCard").prop("loading")).toEqual(
      props.accountsInfo.isLoadingAddress
    );
    expect(infos.find("ReceiveFundsCard").length).toBe(1);
  });

  it("account-view-infos component should contain Quicklook component", () => {
    const wrapper = shallow(<AccountViewNotDecorated {...props} />);
    const infos = wrapper.find(".account-view-infos");
    expect(infos.find("Quicklook").prop("operations")).toEqual(
      props.accountsInfo.operations
    );
    expect(infos.find("Quicklook").prop("loading")).toEqual(
      props.accountsInfo.isLoadingOperations ||
        props.accountsInfo.isLoadingNextOperations
    );
    expect(infos.find("Quicklook").length).toBe(1);
  });

  it("account-view component should contain ListOperation component", () => {
    const wrapper = shallow(<AccountViewNotDecorated {...props} />);
    const infos = wrapper.find(".account-view");
    expect(infos.find("List").length).toBe(1);
    expect(infos.find("List").prop("operations")).toEqual(
      props.accountsInfo.operations
    );
    expect(infos.find("List").prop("loading")).toEqual(
      props.accountsInfo.isLoadingOperations
    );
    expect(infos.find("List").prop("open")).toEqual(props.onGetOperation);
  });
});
