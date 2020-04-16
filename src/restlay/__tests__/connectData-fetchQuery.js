// TODO: put back the flow validation when we have time. actually it produce
// a million errors.
//
// @/f/l/o/w/

// then, remove those rules
/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable no-undef */

import React, { Component } from "react";
import invariant from "invariant";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import createMock, {
  AnimalsQuery,
  AnimalQuery,
  AddAnimalMutation,
} from "../tests-utils/mock-1";

test("restlay.fetchQuery can be used to fetch arbitrary queries", async () => {
  const net = networkFromMock(createMock());
  const render = createRender(net.network);
  let fetchQuery: ?Function;
  const Root = connectData(
    class Root extends Component<*> {
      UNSAFE_componentWillMount() {
        fetchQuery = this.props.restlay.fetchQuery;
      }

      render() {
        return null;
      }
    },
  );
  const inst = renderer.create(render(<Root />));
  await renderer.act(flushPromises);
  invariant(fetchQuery, "fetchQuery was loaded");
  const p = fetchQuery(new AnimalQuery({ animalId: "id_doge" }));
  net.tick();
  let res;
  await renderer.act(async () => {
    res = await p;
  });
  expect(res).toMatchObject({ id: "id_doge", name: "doge", age: 5 });
  const p2 = fetchQuery(new AnimalQuery({ animalId: "id_max" }));
  net.tick();
  let res2;
  await renderer.act(async () => {
    res2 = await p2;
  });
  expect(res2).toMatchObject({ id: "id_max", name: "max", age: 14 });
  inst.unmount();
});

test("restlay.fetchQuery from A (no dep) triggers a refresh of B (if depends on fetched data)", async () => {
  const net = networkFromMock(createMock());
  const render = createRender(net.network);
  const Animals = connectData(({ animals }) => `${animals.length}`, {
    queries: {
      animals: AnimalsQuery,
    },
  });
  let restlay;
  const Foo = connectData(props => ((restlay = props.restlay), null));
  const inst = renderer.create(
    render(
      <div>
        <Animals />
        <Foo />
      </div>,
    ),
  );
  invariant(restlay, "restlay is defined");
  net.tick();
  await renderer.act(flushPromises);
  expect(inst.toJSON()).toMatchObject({
    children: ["2"],
  });
  renderer.act(() => {
    restlay.commitMutation(
      new AddAnimalMutation({
        animal: {
          name: "foo",
          age: 42,
        },
      }),
    );
  });
  net.tick();
  await renderer.act(flushPromises);
  // the mutation don't automatically reload the list so UI is still showing 2
  expect(inst.toJSON()).toMatchObject({
    children: ["2"],
  });
  renderer.act(() => {
    restlay.fetchQuery(new AnimalsQuery());
  });
  net.tick();
  await renderer.act(flushPromises);
  // after fetching from Foo sibling, Animals list is now 3
  expect(inst.toJSON()).toMatchObject({
    children: ["3"],
  });
  inst.unmount();
});
