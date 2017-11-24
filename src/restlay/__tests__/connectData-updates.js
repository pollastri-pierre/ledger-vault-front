//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import { mockNetworkSync, AnimalQuery } from "../tests-utils/mock-1";

test("multiple update with same props trigger no re-rendering", async () => {
  const net = networkFromMock(mockNetworkSync);
  const render = createRender(net.network);
  let update = 0;

  const Animal = connectData(
    class Animal extends Component<*> {
      componentWillUpdate() {
        ++update;
      }
      render() {
        return null;
      }
    },
    {
      queries: { animal: AnimalQuery },
      propsToQueryParams: ({ animalId }) => ({ animalId })
    }
  );
  const inst = renderer.create(render(<Animal animalId="id_max" />));
  net.tick();
  await flushPromises();
  expect(update).toBe(0);
  inst.update(render(<Animal animalId="id_max" />));
  net.tick();
  await flushPromises();
  inst.update(render(<Animal animalId="id_max" />));
  net.tick();
  await flushPromises();
  inst.update(render(<Animal animalId="id_max" />));
  net.tick();
  await flushPromises();
  expect(update).toBe(0);
  inst.unmount();
});

test("triggering new queries don't redraw if data doesn't change", async () => {
  expect(this).toBe("implemented");
});
