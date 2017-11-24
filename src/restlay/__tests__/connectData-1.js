//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { syncNetwork, AnimalsQuery } from "../tests-utils/mock-1";

test("the mock-1 and utility functions works", () => {
  const net = networkFromMock(syncNetwork);
  const render = createRender(net.network);
  const inst = renderer.create(render(<div />));
  expect(inst.toJSON()).toMatchSnapshot();
  expect(net.countTickWaiters()).toBe(0);
  expect(net.tick()).toBe(0);
});

test("basic connectData component", async () => {
  const net = networkFromMock(syncNetwork);
  const render = createRender(net.network);
  class AnimalsR extends Component<*> {
    render() {
      const { animals } = this.props;
      return (
        <div>
          {animals.map(a => (
            <div key={a.id}>
              {a.name}: {a.age}
            </div>
          ))}
        </div>
      );
    }
  }
  const Animals = connectData(AnimalsR, {
    queries: {
      animals: AnimalsQuery
    }
  });
  const inst = renderer.create(render(<Animals />));
  expect(inst.toJSON()).toMatchSnapshot();
  expect(net.tick()).toBe(1);
  await flushPromises();
  expect(net.countTickWaiters()).toBe(0);
  expect(inst.toJSON()).toMatchSnapshot();
});
