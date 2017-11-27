//@flow
import React from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import createMock, { AnimalsQuery, AnimalQuery } from "../tests-utils/mock-1";

test("it is possible to query multiple queries", async () => {
  const net = networkFromMock(createMock());
  const render = createRender(net.network);
  const All = connectData(
    ({ animals, animal }) => animal.name + "_" + animals.length,
    {
      queries: {
        animals: AnimalsQuery,
        animal: AnimalQuery
      },
      //$FlowFixMe
      propsToQueryParams: ({ animalId }) => ({ animalId })
    }
  );
  const inst = renderer.create(render(<All animalId="id_doge" />));
  expect(inst.toJSON()).toBe(null);
  expect(net.tick()).toBe(2);
  await flushPromises();
  expect(inst.toJSON()).toBe("doge_2");
  inst.unmount();
});
