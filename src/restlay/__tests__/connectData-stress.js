//@flow
import React from "react";
import invariant from "invariant";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import createMock, { AnimalsQuery, AnimalQuery } from "../tests-utils/mock-1";

test("500 concurrent components only trigger one query and don't break", async () => {
  const net = networkFromMock(createMock());
  const render = createRender(net.network);
  const Animals = connectData(({ animals }) => animals.length, {
    queries: {
      animals: AnimalsQuery
    }
  });
  const Animal = connectData(({ animal }) => animal.id, {
    queries: {
      animal: AnimalQuery
    },
    propsToQueryParams: ({ animalId }) => ({ animalId })
  });
  let restlay;
  const Foo = connectData(props => ((restlay = props.restlay), null));
  const inst = renderer.create(
    render([
      <Foo key="foo" />,
      ...Array(50)
        .fill(null)
        .map((_, k) => <Animals key={k} />),
      ...Array(50)
        .fill(null)
        .map((_, k) => <Animal key={"max_" + k} animalId="id_max" />),
      ...Array(400)
        .fill(null)
        .map((_, k) => <Animal key={"doge_" + k} animalId="id_doge" />)
    ])
  );
  invariant(restlay, "restlay is defined");
  expect(net.tick()).toBe(3);
  await flushPromises();
  expect(inst.toJSON()).toMatchObject([
    ...Array(50).fill("2"),
    ...Array(50).fill("id_max"),
    ...Array(400).fill("id_doge")
  ]);
  inst.unmount();
});
